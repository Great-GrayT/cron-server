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

function toRow(job: JobStatistic): Prisma.JobCreateManyInput {
  return {
    id: job.id,
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

/** Batch dedup: which of these URLs already exist? (one indexed query). */
export async function findExistingUrls(urls: string[]): Promise<Set<string>> {
  if (urls.length === 0) return new Set();
  const rows = await prisma.job.findMany({
    where: { url: { in: urls } },
    select: { url: true },
  });
  return new Set(rows.map((r) => r.url));
}

/** Insert jobs, skipping any whose URL already exists. Returns inserted count. */
export async function insertJobs(jobs: JobStatistic[]): Promise<number> {
  if (jobs.length === 0) return 0;
  const { count } = await prisma.job.createMany({
    data: jobs.map(toRow),
    skipDuplicates: true,
  });
  return count;
}

export async function getJobCounts(): Promise<{ total: number; currentMonth: number }> {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const [total, currentMonth] = await Promise.all([
    prisma.job.count(),
    prisma.job.count({ where: { extractedDate: { gte: monthStart } } }),
  ]);
  return { total, currentMonth };
}

type Facet = Record<string, number>;

/** Top-N for an indexed scalar column via groupBy. */
async function topScalar(
  field: "industry" | "seniority" | "region" | "country",
  n: number,
): Promise<Facet> {
  const rows = await prisma.job.groupBy({
    by: [field],
    _count: { _all: true },
    orderBy: { _count: { [field]: "desc" } },
    where: { [field]: { not: null } } as Prisma.JobWhereInput,
    take: n,
  });
  const out: Facet = {};
  for (const r of rows) {
    const key = (r as Record<string, unknown>)[field];
    if (typeof key === "string" && key) out[key] = r._count._all;
  }
  return out;
}

// Whitelisted array columns — names are interpolated as raw SQL identifiers,
// so they must never come from user input.
const ARRAY_COLUMNS = {
  keywords: "keywords",
  certificates: "certificates",
  software: "software",
  programmingSkills: "programming_skills",
  academicDegrees: "academic_degrees",
} as const;
type ArrayColumn = keyof typeof ARRAY_COLUMNS;

/** Top-N for a multi-value tag column via unnest over the GIN-indexed array. */
async function topArray(column: ArrayColumn, n: number): Promise<Facet> {
  const col = Prisma.raw(`"${ARRAY_COLUMNS[column]}"`);
  const rows = await prisma.$queryRaw<{ value: string; count: bigint }[]>(
    Prisma.sql`
      SELECT unnest(${col}) AS value, COUNT(*)::bigint AS count
      FROM "jobs"
      GROUP BY value
      ORDER BY count DESC
      LIMIT ${n}
    `,
  );
  const out: Facet = {};
  for (const r of rows) out[r.value] = Number(r.count);
  return out;
}

/** Aggregated top stats for the /api/stats/get summary response. */
export async function getAggregatedTopStats(n = 5): Promise<{
  industries: Facet;
  certificates: Facet;
  keywords: Facet;
  seniority: Facet;
  regions: Facet;
  countries: Facet;
}> {
  const [industries, certificates, keywords, seniority, regions, countries] = await Promise.all([
    topScalar("industry", n),
    topArray("certificates", n),
    topArray("keywords", n),
    topScalar("seniority", n),
    topScalar("region", n),
    topScalar("country", n),
  ]);
  return { industries, certificates, keywords, seniority, regions, countries };
}
