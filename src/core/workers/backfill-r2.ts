import { getManifest, streamRecords, type R2Credentials } from "@/services/r2/FUNC-r2-reader";
import { insertJobs } from "@/db/FUNC-jobs-repo";
import {
  updateBackfillJob,
  finishBackfillJob,
  type BackfillLog,
} from "@/db/FUNC-backfill-repo";
import { logger } from "@/lib/logger";
import type { JobRegion, JobStatistic, SalaryData } from "@/types/stats";

/**
 * Async, streaming g2 backfill: import historical jobs from the old Cloudflare
 * R2 store into Postgres, attributed to the admin who triggered it and shared to
 * public stats.
 *
 * Runs detached from the HTTP request (the route returns a jobId immediately and
 * the browser polls the BackfillJob row) so nothing holds a multi-minute
 * connection open — which is what tripped the gateway 502. Each day is streamed
 * in bounded batches (never a whole file in memory), descriptions are joined
 * from the per-day descriptions file, and progress is flushed to the row on a
 * throttle.
 */

interface R2JobMetadata {
  id: string;
  title: string;
  company: string;
  location: string;
  country: string | null;
  city: string | null;
  region: JobRegion | null;
  url: string;
  postedDate: string;
  extractedDate: string;
  keywords: string[];
  certificates: string[];
  industry: string;
  seniority: string;
  salary?: SalaryData | null;
  software?: string[];
  programmingSkills?: string[];
  yearsExperience?: string | null;
  academicDegrees?: string[];
  roleType?: string | null;
  roleCategory?: string | null;
  // tolerated snake_case / alt keys coming from parquet columns
  posted_date?: string;
  extracted_date?: string;
  years_experience?: string | null;
  programming_skills?: string[];
  role_type?: string | null;
  role_category?: string | null;
  academic_degrees?: string[];
}

function str(v: unknown): string {
  return typeof v === "string" ? v : v == null ? "" : String(v);
}
function arr(v: unknown): string[] {
  if (Array.isArray(v)) return v.map(str).filter(Boolean);
  if (typeof v === "string" && v.trim().startsWith("[")) {
    try {
      const parsed = JSON.parse(v);
      return Array.isArray(parsed) ? parsed.map(str).filter(Boolean) : [];
    } catch {
      return [];
    }
  }
  return [];
}

function parseExperience(raw: string | null | undefined): number | null {
  if (!raw) return null;
  const m = String(raw).match(/(\d+)/);
  if (!m) return null;
  const y = parseInt(m[1], 10);
  return y >= 0 && y <= 15 ? y : null;
}

/** Map an R2 metadata record (ndjson OR parquet row) to a JobStatistic. */
function toStatistic(m: R2JobMetadata, description: string): JobStatistic {
  return {
    id: str(m.id),
    title: str(m.title),
    company: str(m.company),
    location: str(m.location),
    country: (m.country as string) ?? null,
    city: (m.city as string) ?? null,
    region: (m.region as JobRegion) ?? null,
    url: str(m.url),
    postedDate: str(m.postedDate ?? m.posted_date),
    extractedDate: str(m.extractedDate ?? m.extracted_date),
    keywords: arr(m.keywords),
    certificates: arr(m.certificates),
    industry: str(m.industry),
    seniority: str(m.seniority),
    description,
    salary: m.salary ?? null,
    software: arr(m.software),
    programmingSkills: arr(m.programmingSkills ?? m.programming_skills),
    experienceYears: parseExperience(m.yearsExperience ?? m.years_experience),
    academicDegrees: arr(m.academicDegrees ?? m.academic_degrees),
    roleType: (m.roleType ?? m.role_type) ?? null,
    roleCategory: (m.roleCategory ?? m.role_category) ?? null,
  };
}

interface DescriptionRecord {
  id?: string;
  url?: string;
  description?: string;
  text?: string;
}

/** Load a day's descriptions into a keyed map (by id and url). Bounded to one
 * day, then released. Missing file -> empty map. */
async function loadDayDescriptions(
  creds: R2Credentials,
  key: string | undefined,
): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  if (!key) return map;
  await streamRecords<DescriptionRecord>(creds, key, async (batch) => {
    for (const d of batch) {
      const text = d.description ?? d.text ?? "";
      if (!text) continue;
      if (d.id) map.set(`id:${d.id}`, text);
      if (d.url) map.set(`url:${d.url}`, text);
    }
  });
  return map;
}

export interface BackfillResult {
  months: number;
  days: number;
  read: number;
  inserted: number;
}

/**
 * Run the backfill against a BackfillJob progress row. Streams every month/day,
 * flushing counters + logs to the row on a throttle. Resilient: a failed day is
 * logged and skipped rather than aborting the whole import.
 */
export async function runBackfillJob(
  jobId: string,
  creds: R2Credentials,
  ownerUserId: string,
): Promise<void> {
  const result: BackfillResult = { months: 0, days: 0, read: 0, inserted: 0 };
  const pending: BackfillLog[] = [];
  let lastFlush = 0;

  const log = (level: BackfillLog["level"], message: string) => {
    pending.push({ level, message, ts: new Date().toISOString() });
    if (level === "error") logger.error(`[backfill ${jobId}] ${message}`);
    else logger.info(`[backfill ${jobId}] ${message}`);
  };

  const flush = async (phase?: string, force = false) => {
    const now = Date.now();
    if (!force && now - lastFlush < 1200 && pending.length === 0) return;
    lastFlush = now;
    const logs = pending.splice(0, pending.length);
    await updateBackfillJob(
      jobId,
      {
        monthsDone: result.months,
        daysDone: result.days,
        read: result.read,
        inserted: result.inserted,
        ...(phase ? { phase } : {}),
      },
      logs,
    );
  };

  try {
    await flush("reading manifest", true);
    const manifest = await getManifest(creds);
    if (!manifest) throw new Error("No manifest.json found in R2 bucket.");

    const months = manifest.availableMonths ?? [];
    log("info", `Manifest loaded: ${months.length} month(s), ${manifest.totalJobsAllTime ?? "?"} jobs all-time.`);
    await flush("importing", true);

    for (const month of months) {
      const monthData = manifest.months[month];
      if (!monthData?.days?.length) continue;
      result.months++;
      log("info", `Month ${month}: ${monthData.days.length} day(s).`);

      for (const day of monthData.days) {
        try {
          // Descriptions for this day, joined by id/url (bounded, then released).
          const descriptions = await loadDayDescriptions(creds, day.descriptions);

          let dayRead = 0;
          await streamRecords<R2JobMetadata>(creds, day.metadata, async (batch) => {
            const jobs = batch
              .filter((m) => str(m.url).includes("http"))
              .map((m) => {
                const desc =
                  descriptions.get(`id:${str(m.id)}`) ?? descriptions.get(`url:${str(m.url)}`) ?? "";
                return toStatistic(m, desc);
              });
            dayRead += batch.length;
            result.read += batch.length;
            result.inserted += await insertJobs(jobs, {
              userId: ownerUserId,
              feedId: null,
              shareToStats: true,
            });
            await flush(`importing ${day.date}`);
          });

          result.days++;
          descriptions.clear();
          log("info", `Day ${day.date}: read ${dayRead}, running total inserted ${result.inserted}.`);
          await flush(`importing ${day.date}`);
        } catch (dayErr) {
          log(
            "error",
            `Day ${day.date} failed: ${dayErr instanceof Error ? dayErr.message : String(dayErr)} (skipped).`,
          );
          await flush(undefined, true);
        }
      }
    }

    await finishBackfillJob(jobId, "done", undefined, {
      level: "success",
      message: `Backfill complete: ${result.inserted} inserted from ${result.read} read across ${result.days} day(s). Now run "Rebuild stats".`,
      ts: new Date().toISOString(),
    });
    logger.info(
      `[backfill ${jobId}] complete: ${result.inserted} inserted / ${result.read} read / ${result.days} days`,
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    await flush(undefined, true).catch(() => {});
    await finishBackfillJob(jobId, "failed", message, {
      level: "error",
      message: `Backfill failed: ${message}`,
      ts: new Date().toISOString(),
    }).catch(() => {});
    logger.error(`[backfill ${jobId}] failed`, err);
  }
}
