import { Prisma } from "@prisma/client";
import { prisma } from "@/db/client";
import { wherePrisma, whereSql, dateRange, type StatsFilters } from "@/lib/FUNC-stats-filters";
import {
  isRollupReady,
  rollupSummary,
  rollupScalar,
  rollupTag,
  rollupExperience,
  rollupTimeline,
  rollupHeatmap,
  rollupHourly,
  rollupSalary,
} from "@/db/FUNC-stats-rollup";

/**
 * Rollups can answer a request only when it's the PUBLIC scope with no facet /
 * search / range filters (just an optional date window) — because the summary
 * tables are pre-grouped at day grain. Anything more specific falls back to a
 * live, date-bounded query below.
 */
function rollupEligible(f: StatsFilters): boolean {
  return (
    f.scope === "public" &&
    !f.industry && !f.seniority && !f.country && !f.region && !f.city &&
    !f.roleType && !f.roleCategory && !f.company &&
    !f.keyword && !f.certificate && !f.software && !f.programming && !f.degree &&
    f.salaryMin === undefined && f.salaryMax === undefined &&
    f.expMin === undefined && f.expMax === undefined &&
    !f.q
  );
}

async function canRollup(f: StatsFilters): Promise<boolean> {
  return rollupEligible(f) && (await isRollupReady());
}

/**
 * Stats aggregation repository — one query per stats-page component, filter +
 * search + scope aware.
 *
 * Scope (from the filters): "public" = the shared-to-stats union across all
 * users; "me" = the authenticated user's own jobs. Because a single job URL can
 * belong to multiple users, every public aggregate counts **DISTINCT url** so a
 * widely-shared posting is counted once.
 */

export type Facet = Record<string, number>;

const SCALAR_COLUMNS = {
  industry: "industry",
  seniority: "seniority",
  country: "country",
  region: "region",
  city: "city",
  roleCategory: "role_category",
  roleType: "role_type",
  company: "company",
} as const;
type ScalarField = keyof typeof SCALAR_COLUMNS;

// ---- scalar facets (Industry treemap, Seniority waffle, World map, roles) ----

export async function facetScalar(field: ScalarField, f: StatsFilters, userId?: string): Promise<Facet> {
  if (await canRollup(f)) {
    const { from, to } = dateRange(f);
    return rollupScalar(SCALAR_COLUMNS[field], from, to, f.limit);
  }
  const col = Prisma.raw(`"${SCALAR_COLUMNS[field]}"`);
  const rows = await prisma.$queryRaw<{ key: string; c: number }[]>(Prisma.sql`
    SELECT ${col} AS key, COUNT(*)::int AS c
    FROM "jobs" ${whereSql(f, userId)} AND ${col} IS NOT NULL
    GROUP BY 1 ORDER BY c DESC LIMIT ${f.limit}
  `);
  const out: Facet = {};
  for (const r of rows) if (r.key) out[r.key] = r.c;
  return out;
}

// ---- array-tag facets (Skills word cloud, Certs) ----

const ARRAY_COLUMNS = {
  keywords: "keywords",
  certificates: "certificates",
  software: "software",
  programmingSkills: "programming_skills",
  academicDegrees: "academic_degrees",
} as const;
type ArrayKey = keyof typeof ARRAY_COLUMNS;

export async function facetArray(key: ArrayKey, f: StatsFilters, userId?: string): Promise<Facet> {
  if (await canRollup(f)) {
    const { from, to } = dateRange(f);
    return rollupTag(ARRAY_COLUMNS[key], from, to, f.limit);
  }
  const col = Prisma.raw(`"${ARRAY_COLUMNS[key]}"`);
  const rows = await prisma.$queryRaw<{ value: string; c: number }[]>(Prisma.sql`
    SELECT t.value AS value, COUNT(*)::int AS c
    FROM "jobs" j, LATERAL unnest(j.${col}) AS t(value)
    ${whereSql(f, userId)}
    GROUP BY t.value ORDER BY c DESC LIMIT ${f.limit}
  `);
  const out: Facet = {};
  for (const r of rows) out[r.value] = r.c;
  return out;
}

/** Experience-years distribution. */
export async function facetExperience(f: StatsFilters, userId?: string): Promise<Facet> {
  if (await canRollup(f)) {
    const { from, to } = dateRange(f);
    return rollupExperience(from, to);
  }
  const rows = await prisma.$queryRaw<{ y: number; c: number }[]>(Prisma.sql`
    SELECT experience_years AS y, COUNT(*)::int AS c
    FROM "jobs" ${whereSql(f, userId)} AND experience_years IS NOT NULL
    GROUP BY 1 ORDER BY 1 ASC
  `);
  const out: Facet = {};
  for (const r of rows) out[String(r.y)] = r.c;
  return out;
}

// ---- composite payloads ----

export async function locations(f: StatsFilters, userId?: string) {
  const [countries, regions, cities] = await Promise.all([
    facetScalar("country", f, userId),
    facetScalar("region", f, userId),
    facetScalar("city", f, userId),
  ]);
  return { countries, regions, cities };
}

export async function skills(f: StatsFilters, userId?: string) {
  const [keywords, software, programming] = await Promise.all([
    facetArray("keywords", f, userId),
    facetArray("software", f, userId),
    facetArray("programmingSkills", f, userId),
  ]);
  return { keywords, software, programming };
}

// ---- time series ----

const SERIES_COLUMNS: Record<string, string> = {
  industry: "industry",
  seniority: "seniority",
  country: "country",
  region: "region",
  roleCategory: "role_category",
  roleType: "role_type",
  company: "company",
};

export async function timeline(f: StatsFilters, series?: string, userId?: string) {
  const seriesCol = series && SERIES_COLUMNS[series] ? SERIES_COLUMNS[series] : null;
  if (await canRollup(f)) {
    const { from, to } = dateRange(f);
    const r = await rollupTimeline(seriesCol, from, to);
    return seriesCol ? { series, points: r.points } : { series: null, points: r.points };
  }
  const w = whereSql(f, userId);
  if (seriesCol) {
    const col = Prisma.raw(`"${seriesCol}"`);
    const rows = await prisma.$queryRaw<{ d: string; k: string; c: number }[]>(Prisma.sql`
      SELECT to_char(date_trunc('day', posted_date), 'YYYY-MM-DD') AS d, ${col} AS k, COUNT(*)::int AS c
      FROM "jobs" ${w} AND ${col} IS NOT NULL
      GROUP BY 1, 2 ORDER BY 1 ASC
    `);
    return { series, points: rows };
  }
  const rows = await prisma.$queryRaw<{ d: string; c: number }[]>(Prisma.sql`
    SELECT to_char(date_trunc('day', posted_date), 'YYYY-MM-DD') AS d, COUNT(*)::int AS c
    FROM "jobs" ${w}
    GROUP BY 1 ORDER BY 1 ASC
  `);
  return { series: null, points: rows };
}

export async function heatmap(f: StatsFilters, userId?: string) {
  if (await canRollup(f)) {
    const { from, to } = dateRange(f);
    return rollupHeatmap(from, to);
  }
  return prisma.$queryRaw<{ dow: number; hour: number; c: number }[]>(Prisma.sql`
    SELECT EXTRACT(DOW FROM extracted_date)::int AS dow,
           EXTRACT(HOUR FROM extracted_date)::int AS hour,
           COUNT(*)::int AS c
    FROM "jobs" ${whereSql(f, userId)}
    GROUP BY 1, 2 ORDER BY 1, 2
  `);
}

export async function hourly(f: StatsFilters, userId?: string) {
  if (await canRollup(f)) {
    const { from, to } = dateRange(f);
    return rollupHourly(from, to);
  }
  return prisma.$queryRaw<{ hour: number; c: number }[]>(Prisma.sql`
    SELECT EXTRACT(HOUR FROM extracted_date)::int AS hour, COUNT(*)::int AS c
    FROM "jobs" ${whereSql(f, userId)}
    GROUP BY 1 ORDER BY 1
  `);
}

// ---- salary ----

export async function salary(f: StatsFilters, userId?: string) {
  if (await canRollup(f)) {
    const { from, to } = dateRange(f);
    return rollupSalary(from, to);
  }
  const w = whereSql(f, userId);
  const salaryCond = Prisma.sql`(salary_min IS NOT NULL OR salary_max IS NOT NULL)`;
  const cond = Prisma.sql`${w} AND ${salaryCond}`;
  const mid = Prisma.raw(`COALESCE((salary_min + salary_max) / 2.0, salary_min, salary_max)`);

  const [agg] = await prisma.$queryRaw<
    { total: number; avg: number | null; median: number | null; min: number | null; max: number | null }[]
  >(Prisma.sql`
    SELECT COUNT(*)::int AS total,
           ROUND(AVG(${mid}))::int AS avg,
           ROUND(PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY ${mid}))::int AS median,
           MIN(${mid})::int AS min,
           MAX(${mid})::int AS max
    FROM "jobs" ${cond}
  `);

  const ranges = await prisma.$queryRaw<{ bucket: string; c: number }[]>(Prisma.sql`
    SELECT CASE
      WHEN ${mid} < 30000 THEN '0-30k'
      WHEN ${mid} < 50000 THEN '30-50k'
      WHEN ${mid} < 75000 THEN '50-75k'
      WHEN ${mid} < 100000 THEN '75-100k'
      WHEN ${mid} < 150000 THEN '100-150k'
      ELSE '150k+' END AS bucket, COUNT(*)::int AS c
    FROM "jobs" ${cond}
    GROUP BY 1
  `);

  const currencies = await prisma.$queryRaw<{ currency: string; c: number }[]>(Prisma.sql`
    SELECT salary_currency AS currency, COUNT(*)::int AS c
    FROM "jobs" ${w} AND salary_currency IS NOT NULL
    GROUP BY 1 ORDER BY 2 DESC
  `);

  const byCurrency: Facet = {};
  for (const r of currencies) byCurrency[r.currency] = r.c;
  const salaryRanges: Facet = {};
  for (const r of ranges) salaryRanges[r.bucket] = r.c;

  return {
    totalWithSalary: agg?.total ?? 0,
    averageSalary: agg?.avg ?? null,
    medianSalary: agg?.median ?? null,
    minSalary: agg?.min ?? null,
    maxSalary: agg?.max ?? null,
    salaryRanges,
    byCurrency,
  };
}

// ---- summary + jobs list ----

export async function summary(f: StatsFilters, userId?: string) {
  if (await canRollup(f)) {
    const { from, to } = dateRange(f);
    return rollupSummary(from, to);
  }
  const [row] = await prisma.$queryRaw<{ total: number; with_salary: number }[]>(Prisma.sql`
    SELECT COUNT(*)::int AS total,
           COUNT(*) FILTER (WHERE salary_min IS NOT NULL OR salary_max IS NOT NULL)::int AS with_salary
    FROM "jobs" ${whereSql(f, userId)}
  `);
  return { total: row?.total ?? 0, withSalary: row?.with_salary ?? 0 };
}

const LIST_SELECT = {
  id: true,
  title: true,
  company: true,
  location: true,
  country: true,
  city: true,
  region: true,
  industry: true,
  seniority: true,
  roleType: true,
  roleCategory: true,
  url: true,
  postedDate: true,
  extractedDate: true,
  keywords: true,
  certificates: true,
  salaryMin: true,
  salaryMax: true,
  salaryCurrency: true,
} satisfies Prisma.JobSelect;

export async function jobsList(f: StatsFilters, userId?: string) {
  const where = wherePrisma(f, userId);
  const sortField = f.sort === "extractedDate" ? "extractedDate" : "postedDate";
  const [total, rows] = await Promise.all([
    prisma.job.count({ where }),
    prisma.job.findMany({
      where,
      select: f.withDescription ? { ...LIST_SELECT, description: true } : LIST_SELECT,
      orderBy: { [sortField]: f.order },
      skip: (f.page - 1) * f.pageSize,
      take: f.pageSize,
    }),
  ]);
  return { total, page: f.page, pageSize: f.pageSize, totalPages: Math.ceil(total / f.pageSize), jobs: rows };
}

export async function jobDescription(id: string): Promise<string | null> {
  const row = await prisma.job.findUnique({ where: { id }, select: { description: true } });
  return row?.description ?? null;
}

/** Distinct YYYY-MM posting months present — powers the month-picker dropdown. */
export async function monthsList(f: StatsFilters, userId?: string): Promise<string[]> {
  if (f.scope === "public" && (await isRollupReady())) {
    const rows = await prisma.$queryRaw<{ m: string }[]>(
      Prisma.sql`SELECT DISTINCT to_char(day,'YYYY-MM') AS m FROM stats_daily ORDER BY m DESC`,
    );
    return rows.map((r) => r.m).filter(Boolean);
  }
  const base =
    f.scope === "me"
      ? Prisma.sql`id IN (SELECT uj.job_id FROM "user_jobs" uj WHERE uj.user_id = ${userId}::uuid)`
      : Prisma.sql`shared_to_stats = true`;
  const rows = await prisma.$queryRaw<{ m: string }[]>(
    Prisma.sql`SELECT DISTINCT to_char(posted_date,'YYYY-MM') AS m FROM "jobs" WHERE ${base} ORDER BY m DESC`,
  );
  return rows.map((r) => r.m).filter(Boolean);
}

/** Distinct values per facet — populates the UI filter dropdowns (public scope). */
export async function filterOptions() {
  const fields: ScalarField[] = ["industry", "seniority", "country", "region", "roleCategory"];
  const entries = await Promise.all(
    fields.map(async (field) => {
      const col = Prisma.raw(`"${SCALAR_COLUMNS[field]}"`);
      const rows = await prisma.$queryRaw<{ key: string }[]>(Prisma.sql`
        SELECT ${col} AS key FROM "jobs"
        WHERE shared_to_stats = true AND ${col} IS NOT NULL
        GROUP BY 1 ORDER BY COUNT(*) DESC LIMIT 200
      `);
      return [field, rows.map((r) => r.key).filter(Boolean)] as const;
    }),
  );
  return Object.fromEntries(entries) as Record<ScalarField, string[]>;
}
