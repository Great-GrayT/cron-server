import { Prisma } from "@prisma/client";
import { prisma } from "@/db/client";
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

function toJobRow(job: JobStatistic, sharedToStats: boolean): Prisma.JobCreateInput {
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
    description: job.description ?? "",
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
export async function insertJobs(jobs: JobStatistic[], owner: JobOwner): Promise<number> {
  if (jobs.length === 0) return 0;

  // Upsert each global Job row, collecting url -> jobId.
  const jobIdByUrl = new Map<string, string>();
  for (const j of jobs) {
    const row = await prisma.job.upsert({
      where: { url: j.url },
      create: toJobRow(j, owner.shareToStats),
      // Never downgrade an already-public job; upgrade it if this owner shares.
      update: owner.shareToStats ? { sharedToStats: true } : {},
      select: { id: true },
    });
    jobIdByUrl.set(j.url, row.id);
  }

  // Link them to this user (skip any that somehow already exist).
  const { count } = await prisma.userJob.createMany({
    data: jobs.map((j) => ({
      userId: owner.userId,
      jobId: jobIdByUrl.get(j.url)!,
      feedId: owner.feedId ?? null,
      shareToStats: owner.shareToStats,
    })),
    skipDuplicates: true,
  });
  return count;
}

/** The reserved system account that owns legacy/global/backfilled jobs. */
export async function getSystemUserId(): Promise<string> {
  const user = await prisma.user.upsert({
    where: { email: "system@cron.local" },
    create: { email: "system@cron.local", name: "System", role: "system" },
    update: {},
    select: { id: true },
  });
  return user.id;
}
