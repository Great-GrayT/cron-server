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

function toRow(job: JobStatistic, owner: JobOwner): Prisma.JobCreateManyInput {
  return {
    extId: job.id, // stable metadata hash (PK is now a uuid)
    userId: owner.userId,
    feedId: owner.feedId ?? null,
    shareToStats: owner.shareToStats,
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

/** Batch dedup for one user: which of these URLs do they already have? */
export async function findExistingUrls(userId: string, urls: string[]): Promise<Set<string>> {
  if (urls.length === 0) return new Set();
  const rows = await prisma.job.findMany({
    where: { userId, url: { in: urls } },
    select: { url: true },
  });
  return new Set(rows.map((r) => r.url));
}

/** Insert jobs for an owner, skipping any (userId,url) that already exists. */
export async function insertJobs(jobs: JobStatistic[], owner: JobOwner): Promise<number> {
  if (jobs.length === 0) return 0;
  const { count } = await prisma.job.createMany({
    data: jobs.map((j) => toRow(j, owner)),
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
