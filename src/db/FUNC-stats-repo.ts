import { Prisma } from "@prisma/client";
import { prisma } from "@/db/client";
import { wherePrisma, whereSql, type StatsFilters } from "@/lib/FUNC-stats-filters";

/**
 * Stats aggregation repository — one query per stats-page component, every one
 * filter + search aware. Scalar facets use Prisma `groupBy`; multi-value tags
 * and time buckets use parameterised `$queryRaw` over the GIN/B-tree indexes.
 */

export type Facet = Record<string, number>;

// ---- scalar facets (Industry treemap, Seniority waffle, World map, roles) ----

type ScalarField = "industry" | "seniority" | "country" | "region" | "city" | "roleCategory" | "roleType" | "company";

// Columns that are nullable in the schema — only these accept a `not: null` filter.
const NULLABLE_FIELDS = new Set<ScalarField>(["country", "region", "city", "roleCategory", "roleType"]);

function notNullWhere(field: ScalarField, base: Prisma.JobWhereInput): Prisma.JobWhereInput {
  return NULLABLE_FIELDS.has(field) ? ({ ...base, [field]: { not: null } } as Prisma.JobWhereInput) : base;
}

export async function facetScalar(field: ScalarField, f: StatsFilters): Promise<Facet> {
  const rows = await prisma.job.groupBy({
    by: [field],
    where: notNullWhere(field, wherePrisma(f)),
    _count: { _all: true },
    orderBy: { _count: { [field]: "desc" } },
    take: f.limit,
  });
  const out: Facet = {};
  for (const r of rows) {
    const key = (r as Record<string, unknown>)[field];
    if (typeof key === "string" && key) out[key] = r._count._all;
  }
  return out;
}

/** Experience-years distribution (numeric facet / histogram). */
export async function facetExperience(f: StatsFilters): Promise<Facet> {
  const rows = await prisma.job.groupBy({
    by: ["experienceYears"],
    where: { ...wherePrisma(f), experienceYears: { not: null } },
    _count: { _all: true },
    orderBy: { experienceYears: "asc" },
  });
  const out: Facet = {};
  for (const r of rows) if (r.experienceYears !== null) out[String(r.experienceYears)] = r._count._all;
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

export async function facetArray(key: ArrayKey, f: StatsFilters): Promise<Facet> {
  const col = Prisma.raw(`"${ARRAY_COLUMNS[key]}"`);
  const rows = await prisma.$queryRaw<{ value: string; c: number }[]>(Prisma.sql`
    SELECT unnest(${col}) AS value, COUNT(*)::int AS c
    FROM "jobs"
    ${whereSql(f)}
    GROUP BY value
    ORDER BY c DESC
    LIMIT ${f.limit}
  `);
  const out: Facet = {};
  for (const r of rows) out[r.value] = r.c;
  return out;
}

// ---- composite component payloads ----

export async function locations(f: StatsFilters) {
  const [countries, regions, cities] = await Promise.all([
    facetScalar("country", f),
    facetScalar("region", f),
    facetScalar("city", f),
  ]);
  return { countries, regions, cities };
}

export async function skills(f: StatsFilters) {
  const [keywords, software, programming] = await Promise.all([
    facetArray("keywords", f),
    facetArray("software", f),
    facetArray("programmingSkills", f),
  ]);
  return { keywords, software, programming };
}

// ---- time series (Velocity stream, Certs bump, Posting heatmap, Time radial) ----

const SERIES_COLUMNS: Record<string, string> = {
  industry: "industry",
  seniority: "seniority",
  country: "country",
  region: "region",
  roleCategory: "role_category",
  roleType: "role_type",
  company: "company",
};

/** Daily counts; with `series` (a scalar facet) → daily counts per category. */
export async function timeline(f: StatsFilters, series?: string) {
  const w = whereSql(f);
  if (series && SERIES_COLUMNS[series]) {
    const col = Prisma.raw(`"${SERIES_COLUMNS[series]}"`);
    const cond = w === Prisma.empty ? Prisma.sql`WHERE ${col} IS NOT NULL` : Prisma.sql`${w} AND ${col} IS NOT NULL`;
    const rows = await prisma.$queryRaw<{ d: string; k: string; c: number }[]>(Prisma.sql`
      SELECT to_char(date_trunc('day', extracted_date), 'YYYY-MM-DD') AS d, ${col} AS k, COUNT(*)::int AS c
      FROM "jobs" ${cond}
      GROUP BY 1, 2
      ORDER BY 1 ASC
    `);
    return { series, points: rows };
  }
  const rows = await prisma.$queryRaw<{ d: string; c: number }[]>(Prisma.sql`
    SELECT to_char(date_trunc('day', extracted_date), 'YYYY-MM-DD') AS d, COUNT(*)::int AS c
    FROM "jobs" ${w}
    GROUP BY 1
    ORDER BY 1 ASC
  `);
  return { series: null, points: rows };
}

/** Day-of-week × hour matrix (Posting heatmap). dow: 0=Sun..6=Sat. */
export async function heatmap(f: StatsFilters) {
  const rows = await prisma.$queryRaw<{ dow: number; hour: number; c: number }[]>(Prisma.sql`
    SELECT EXTRACT(DOW FROM extracted_date)::int AS dow,
           EXTRACT(HOUR FROM extracted_date)::int AS hour,
           COUNT(*)::int AS c
    FROM "jobs"
    ${whereSql(f)}
    GROUP BY 1, 2
    ORDER BY 1, 2
  `);
  return rows;
}

/** Counts per hour of day (Time radial). */
export async function hourly(f: StatsFilters) {
  const rows = await prisma.$queryRaw<{ hour: number; c: number }[]>(Prisma.sql`
    SELECT EXTRACT(HOUR FROM extracted_date)::int AS hour, COUNT(*)::int AS c
    FROM "jobs"
    ${whereSql(f)}
    GROUP BY 1
    ORDER BY 1
  `);
  return rows;
}

// ---- salary (Salary gauges) ----

export async function salary(f: StatsFilters) {
  const w = whereSql(f);
  const salaryCond = Prisma.sql`(salary_min IS NOT NULL OR salary_max IS NOT NULL)`;
  const cond = w === Prisma.empty ? Prisma.sql`WHERE ${salaryCond}` : Prisma.sql`${w} AND ${salaryCond}`;
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
    FROM "jobs" ${w === Prisma.empty ? Prisma.sql`WHERE salary_currency IS NOT NULL` : Prisma.sql`${w} AND salary_currency IS NOT NULL`}
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

// ---- summary + jobs list (rss page / job table) ----

export async function summary(f: StatsFilters) {
  const where = wherePrisma(f);
  const [total, withSalary] = await Promise.all([
    prisma.job.count({ where }),
    prisma.job.count({ where: { ...where, OR: [{ salaryMin: { not: null } }, { salaryMax: { not: null } }] } }),
  ]);
  return { total, withSalary };
}

/** Metadata-only fields for list views (description omitted unless requested). */
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

export async function jobsList(f: StatsFilters) {
  const where = wherePrisma(f);
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
  return {
    total,
    page: f.page,
    pageSize: f.pageSize,
    totalPages: Math.ceil(total / f.pageSize),
    jobs: rows,
  };
}

export async function jobDescription(id: string): Promise<string | null> {
  const row = await prisma.job.findUnique({ where: { id }, select: { description: true } });
  return row?.description ?? null;
}

/** Distinct values per facet — populates the UI filter dropdowns. */
export async function filterOptions() {
  const fields: ScalarField[] = ["industry", "seniority", "country", "region", "roleCategory"];
  const entries = await Promise.all(
    fields.map(async (field) => {
      const rows = await prisma.job.groupBy({
        by: [field],
        where: notNullWhere(field, {}),
        _count: { _all: true },
        orderBy: { _count: { [field]: "desc" } },
        take: 200,
      });
      const values = rows
        .map((r) => (r as Record<string, unknown>)[field])
        .filter((v): v is string => typeof v === "string" && v.length > 0);
      return [field, values] as const;
    }),
  );
  return Object.fromEntries(entries) as Record<ScalarField, string[]>;
}
