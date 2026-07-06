import { Prisma } from "@prisma/client";
import { prisma } from "@/db/client";
import { logger } from "@/lib/logger";
import type { JobStatistic } from "@/types/stats";

/**
 * Job persistence + aggregation repository (replaces the R2 statistics cache).
 *
 * All writes go through Prisma (parameterised). Aggregations for the stats page
 * are computed with indexed Postgres queries: scalar facets via `groupBy`, and
 * multi-value tag facets (skills/certs/keywords) via `unnest` over the
 * GIN-indexed array columns.
 */

function safeDate(value: string | Date | undefined): Date {
  const d = value ? new Date(value) : new Date();
  return Number.isNaN(d.getTime()) ? new Date() : d;
}

/** Owner context attached to every inserted job (multi-tenant). */
export interface JobOwner {
  userId: string;
  feedId?: string | null;
  shareToStats: boolean;
}

function toJobRow(job: JobStatistic, sharedToStats: boolean): Prisma.JobCreateManyInput {
  return {
    extId: job.id, // stable metadata hash (PK is a uuid)
    sharedToStats,
    url: job.url,
    title: job.title,
    company: job.company,
    location: job.location,
    country: job.country,
    city: job.city,
    region: job.region,
    postedDate: safeDate(job.postedDate),
    extractedDate: safeDate(job.extractedDate),
    industry: job.industry,
    seniority: job.seniority,
    // description now lives in the JobDescription side table (written separately)
    keywords: job.keywords ?? [],
    certificates: job.certificates ?? [],
    software: job.software ?? [],
    programmingSkills: job.programmingSkills ?? [],
    academicDegrees: job.academicDegrees ?? [],
    experienceYears: job.experienceYears ?? null,
    roleType: job.roleType ?? null,
    roleCategory: job.roleCategory ?? null,
    salaryMin: job.salary?.min ?? null,
    salaryMax: job.salary?.max ?? null,
    salaryCurrency: job.salary?.currency ?? null,
    salaryPeriod: job.salary?.period ?? null,
  };
}

// Postgres text rejects NUL (0x00) + other C0 control bytes (keep tab/LF/CR) and
// can't store lone UTF-16 surrogates (they don't encode to valid UTF-8) — strip
// both so a single bad byte from scraped/parquet text can't fail the batch.
const CONTROL_RE = new RegExp("[\u0000-\u0008\u000B\u000C\u000E-\u001F]", "g");

const LONE_SURROGATE_RE = /\p{Cs}/gu; // `u` flag => valid emoji pairs are one non-surrogate code point
function sanitizeText(s: string): string {
  return s.replace(CONTROL_RE, "").replace(LONE_SURROGATE_RE, "");
}

/**
 * Upsert descriptions into the side table. BEST-EFFORT: descriptions are
 * recreatable from the R2 archive, so a bad row must never abort the import
 * (which would leave the day's jobs inserted-but-unlinked). Deduped by jobId
 * (ON CONFLICT can't touch a row twice per statement); on a batch failure, retry
 * per-row and skip only the offender. Never throws.
 */
async function writeDescriptions(pairs: { jobId: string; text: string }[]): Promise<void> {
  const byId = new Map<string, string>();
  for (const p of pairs) {
    const text = sanitizeText(p.text ?? "").trim();
    if (text) byId.set(p.jobId, text); // last write wins; dedupes jobId
  }
  if (byId.size === 0) return;
  const ids = [...byId.keys()];
  const texts = ids.map((id) => byId.get(id)!);

  try {
    await prisma.$executeRaw(Prisma.sql`
      INSERT INTO job_descriptions (job_id, text)
      SELECT * FROM unnest(${ids}::uuid[], ${texts}::text[])
      ON CONFLICT (job_id) DO UPDATE SET text = EXCLUDED.text
    `);
  } catch (err) {
    logger.warn(
      `writeDescriptions batch of ${byId.size} failed; retrying per-row: ${err instanceof Error ? err.message : String(err)}`,
    );
    let skipped = 0;
    for (const id of ids) {
      try {
        await prisma.$executeRaw(Prisma.sql`
          INSERT INTO job_descriptions (job_id, text) VALUES (${id}::uuid, ${byId.get(id)!})
          ON CONFLICT (job_id) DO UPDATE SET text = EXCLUDED.text
        `);
      } catch {
        skipped++; // recreatable from R2 — drop this one, keep going
      }
    }
    if (skipped) logger.warn(`writeDescriptions skipped ${skipped} bad description(s)`);
  }
}

/** Batch dedup for one user: which of these URLs are already linked to them? */
export async function findExistingUrls(userId: string, urls: string[]): Promise<Set<string>> {
  if (urls.length === 0) return new Set();
  const rows = await prisma.userJob.findMany({
    where: { userId, job: { url: { in: urls } } },
    select: { job: { select: { url: true } } },
  });
  return new Set(rows.map((r) => r.job.url));
}

/**
 * Insert jobs for an owner. Each posting is a single global Job row (deduped by
 * url); ownership is a UserJob link. Returns the number of NEW links created
 * (callers pre-filter with findExistingUrls, so that equals jobs added).
 */
const INSERT_CHUNK = 1000;

export async function insertJobs(jobs: JobStatistic[], owner: JobOwner): Promise<number> {
  if (jobs.length === 0) return 0;

  // Dedupe within the batch by url so createMany/link/description see one row per
  // posting (the old per-row upsert deduped implicitly; set-based must be explicit).
  const byUrl = new Map<string, JobStatistic>();
  for (const j of jobs) if (j.url) byUrl.set(j.url, j);
  const unique = [...byUrl.values()];

  let created = 0;
  for (let i = 0; i < unique.length; i += INSERT_CHUNK) {
    const slice = unique.slice(i, i + INSERT_CHUNK);
    const sliceUrls = slice.map((j) => j.url);

    // A) Insert new global Job rows; existing urls are skipped (deduped by url).
    await prisma.job.createMany({
      data: slice.map((j) => toJobRow(j, owner.shareToStats)),
      skipDuplicates: true,
    });

    // B) Never downgrade a public job; upgrade a private one this owner shares.
    if (owner.shareToStats) {
      await prisma.job.updateMany({
        where: { url: { in: sliceUrls }, sharedToStats: false },
        data: { sharedToStats: true },
      });
    }

    // C) Resolve url -> id for the whole slice in one query.
    const rows = await prisma.job.findMany({
      where: { url: { in: sliceUrls } },
      select: { id: true, url: true },
    });
    const idByUrl = new Map(rows.map((r) => [r.url, r.id]));

    // D) Heavy description text -> slim side table (only non-empty).
    await writeDescriptions(
      slice
        .filter((j) => (j.description ?? "") !== "" && idByUrl.has(j.url))
        .map((j) => ({ jobId: idByUrl.get(j.url)!, text: j.description! })),
    );

    // E) Link them to this user (skip any link that already exists).
    const { count } = await prisma.userJob.createMany({
      data: slice
        .filter((j) => idByUrl.has(j.url))
        .map((j) => ({
          userId: owner.userId,
          jobId: idByUrl.get(j.url)!,
          feedId: owner.feedId ?? null,
          shareToStats: owner.shareToStats,
        })),
      skipDuplicates: true,
    });
    created += count;
  }
  return created;
}

/** The reserved system account that owns legacy/global ingest jobs. */
export async function getSystemUserId(): Promise<string> {
  const user = await prisma.user.upsert({
    where: { email: "system@cron.local" },
    create: { email: "system@cron.local", name: "System", role: "system" },
    update: {},
    select: { id: true },
  });
  return user.id;
}
