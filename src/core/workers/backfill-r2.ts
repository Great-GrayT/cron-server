import { getManifest, getNDJSONGzipped, type R2Credentials } from "@/services/r2/FUNC-r2-reader";
import { insertJobs } from "@/db/FUNC-jobs-repo";
import { logger } from "@/lib/logger";
import type { JobRegion, JobStatistic, SalaryData } from "@/types/stats";

/**
 * One-time g2 backfill: import historical jobs from the old Cloudflare R2 store
 * into Postgres, attributed to the system account and shared to public stats.
 *
 * Reads the R2 manifest, then each day's gzipped metadata NDJSON, maps it to a
 * JobStatistic, and inserts owned by the admin who triggered it (a real
 * account). R2 credentials are passed in (forwarded from the admin page), never
 * stored. Description text is not backfilled (it lived in separate heavy files).
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
}

function parseExperience(raw: string | null | undefined): number | null {
  if (!raw) return null;
  const m = raw.match(/(\d+)/);
  if (!m) return null;
  const y = parseInt(m[1], 10);
  return y >= 0 && y <= 15 ? y : null;
}

function toStatistic(m: R2JobMetadata): JobStatistic {
  return {
    id: m.id,
    title: m.title,
    company: m.company,
    location: m.location,
    country: m.country,
    city: m.city,
    region: m.region,
    url: m.url,
    postedDate: m.postedDate,
    extractedDate: m.extractedDate,
    keywords: m.keywords ?? [],
    certificates: m.certificates ?? [],
    industry: m.industry,
    seniority: m.seniority,
    description: "",
    salary: m.salary ?? null,
    software: m.software ?? [],
    programmingSkills: m.programmingSkills ?? [],
    experienceYears: parseExperience(m.yearsExperience),
    academicDegrees: m.academicDegrees ?? [],
    roleType: m.roleType ?? null,
    roleCategory: m.roleCategory ?? null,
  };
}

export interface BackfillResult {
  months: number;
  days: number;
  read: number;
  inserted: number;
}

export async function backfillFromR2(creds: R2Credentials, ownerUserId: string): Promise<BackfillResult> {
  const manifest = await getManifest(creds);
  if (!manifest) throw new Error("No manifest.json found in R2 bucket.");

  const userId = ownerUserId;
  const result: BackfillResult = { months: 0, days: 0, read: 0, inserted: 0 };

  for (const month of manifest.availableMonths) {
    const monthData = manifest.months[month];
    if (!monthData?.days?.length) continue;
    result.months++;

    for (const day of monthData.days) {
      const metadata = await getNDJSONGzipped<R2JobMetadata>(creds, day.metadata);
      if (metadata.length === 0) continue;
      result.days++;
      result.read += metadata.length;

      const jobs = metadata.filter((m) => m.url && m.url.includes("http")).map(toStatistic);
      result.inserted += await insertJobs(jobs, { userId, feedId: null, shareToStats: true });
      logger.info(`Backfill ${day.date}: read ${metadata.length}, total inserted ${result.inserted}`);
    }
  }

  logger.info(`Backfill complete: ${result.inserted} inserted from ${result.read} read (${result.days} days)`);
  return result;
}
