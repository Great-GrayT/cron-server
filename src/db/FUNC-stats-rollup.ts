import { Prisma } from "@prisma/client";
import { prisma } from "@/db/client";

/**
 * Materialized stats rollups — the enterprise "summary table / OLAP rollup"
 * pattern (Oracle materialized views w/ incremental refresh, done in Postgres).
 *
 * Raw `jobs` is the fact table. These pre-aggregated tables are the read model
 * for the PUBLIC stats dashboard, at day grain:
 *   stats_daily      — per-day totals + salary sums/min/max + salary range buckets
 *   stats_daily_dim  — per-day scalar facet counts (industry, seniority, … currency, experience)
 *   stats_daily_tag  — per-day array-tag counts (keywords, certificates, software, …)
 *   stats_dow_hour   — per-day day-of-week × hour counts (heatmap / hourly)
 *   stats_meta       — readiness flag
 *
 * The dashboard's default (unfiltered) view reads tiny windows of these instead
 * of scanning millions of raw rows. Filtered drill-downs fall back to a live,
 * date-bounded query in FUNC-stats-repo.
 */

export type Facet = Record<string, number>;

// Scalar facet dimensions stored in stats_daily_dim.dim (the raw column name).
const SCALAR_DIMS = [
  "industry",
  "seniority",
  "country",
  "region",
  "city",
  "role_category",
  "role_type",
  "company",
  "salary_currency",
] as const;

// Array-tag facets stored in stats_daily_tag.tag_type (the raw column name).
const TAG_COLS = ["keywords", "certificates", "software", "programming_skills", "academic_degrees"] as const;

const MID = Prisma.raw(`COALESCE((salary_min + salary_max) / 2.0, salary_min, salary_max)`);

// ---- schema (idempotent, no migration required) ------------------------------

export async function ensureRollupTables(): Promise<void> {
  await prisma.$executeRaw`CREATE TABLE IF NOT EXISTS stats_daily (
    day date PRIMARY KEY,
    total int NOT NULL DEFAULT 0,
    with_salary int NOT NULL DEFAULT 0,
    salary_sum double precision NOT NULL DEFAULT 0,
    salary_cnt int NOT NULL DEFAULT 0,
    salary_min double precision,
    salary_max double precision,
    r0 int NOT NULL DEFAULT 0, r30 int NOT NULL DEFAULT 0, r50 int NOT NULL DEFAULT 0,
    r75 int NOT NULL DEFAULT 0, r100 int NOT NULL DEFAULT 0, r150 int NOT NULL DEFAULT 0
  )`;
  await prisma.$executeRaw`CREATE TABLE IF NOT EXISTS stats_daily_dim (
    day date NOT NULL, dim text NOT NULL, val text NOT NULL, cnt int NOT NULL,
    PRIMARY KEY (day, dim, val)
  )`;
  await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS stats_daily_dim_lookup ON stats_daily_dim (dim, day)`;
  await prisma.$executeRaw`CREATE TABLE IF NOT EXISTS stats_daily_tag (
    day date NOT NULL, tag_type text NOT NULL, tag text NOT NULL, cnt int NOT NULL,
    PRIMARY KEY (day, tag_type, tag)
  )`;
  await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS stats_daily_tag_lookup ON stats_daily_tag (tag_type, day)`;
  await prisma.$executeRaw`CREATE TABLE IF NOT EXISTS stats_dow_hour (
    day date NOT NULL, dow int NOT NULL, hour int NOT NULL, cnt int NOT NULL,
    PRIMARY KEY (day, dow, hour)
  )`;
  await prisma.$executeRaw`CREATE TABLE IF NOT EXISTS stats_meta (key text PRIMARY KEY, val text NOT NULL)`;
}

// ---- readiness (cached) ------------------------------------------------------

let readyCache: { at: number; ready: boolean } | null = null;
const READY_TTL_MS = 60_000;

export async function isRollupReady(): Promise<boolean> {
  if (readyCache && Date.now() - readyCache.at < READY_TTL_MS) return readyCache.ready;
  let ready = false;
  try {
    const rows = await prisma.$queryRaw<{ val: string }[]>(
      Prisma.sql`SELECT val FROM stats_meta WHERE key = 'ready' LIMIT 1`,
    );
    ready = rows[0]?.val === "1";
  } catch {
    ready = false; // tables not created yet
  }
  readyCache = { at: Date.now(), ready };
  return ready;
}

function invalidateReady() {
  readyCache = null;
}

// ---- refresh (incremental, per-day) ------------------------------------------

/** Recompute rollups for the given YYYY-MM-DD days from raw jobs (public scope). */
export async function refreshDays(days: string[]): Promise<void> {
  await ensureRollupTables();
  for (const day of days) {
    const d = Prisma.sql`${day}::date`;
    // Rollups are keyed by the real posting date (posted_date).
    const win = Prisma.sql`shared_to_stats = true AND posted_date >= ${day}::date AND posted_date < (${day}::date + INTERVAL '1 day')`;

    await prisma.$transaction([
      prisma.$executeRaw`DELETE FROM stats_daily WHERE day = ${day}::date`,
      prisma.$executeRaw`DELETE FROM stats_daily_dim WHERE day = ${day}::date`,
      prisma.$executeRaw`DELETE FROM stats_daily_tag WHERE day = ${day}::date`,
      prisma.$executeRaw`DELETE FROM stats_dow_hour WHERE day = ${day}::date`,

      prisma.$executeRaw(Prisma.sql`
        INSERT INTO stats_daily (day,total,with_salary,salary_sum,salary_cnt,salary_min,salary_max,r0,r30,r50,r75,r100,r150)
        WITH j AS (SELECT ${MID} AS mid, (salary_min IS NOT NULL OR salary_max IS NOT NULL) AS has_sal FROM "jobs" WHERE ${win})
        SELECT ${d}, COUNT(*)::int,
          COUNT(*) FILTER (WHERE has_sal)::int,
          COALESCE(SUM(mid) FILTER (WHERE mid IS NOT NULL), 0),
          COUNT(*) FILTER (WHERE mid IS NOT NULL)::int,
          MIN(mid), MAX(mid),
          COUNT(*) FILTER (WHERE mid < 30000)::int,
          COUNT(*) FILTER (WHERE mid >= 30000 AND mid < 50000)::int,
          COUNT(*) FILTER (WHERE mid >= 50000 AND mid < 75000)::int,
          COUNT(*) FILTER (WHERE mid >= 75000 AND mid < 100000)::int,
          COUNT(*) FILTER (WHERE mid >= 100000 AND mid < 150000)::int,
          COUNT(*) FILTER (WHERE mid >= 150000)::int
        FROM j
        HAVING COUNT(*) > 0
      `),

      ...SCALAR_DIMS.map((dim) => {
        const col = Prisma.raw(`"${dim}"`);
        return prisma.$executeRaw(Prisma.sql`
          INSERT INTO stats_daily_dim (day,dim,val,cnt)
          SELECT ${d}, ${dim}, ${col}, COUNT(*)::int
          FROM "jobs" WHERE ${win} AND ${col} IS NOT NULL
          GROUP BY ${col}
        `);
      }),
      prisma.$executeRaw(Prisma.sql`
        INSERT INTO stats_daily_dim (day,dim,val,cnt)
        SELECT ${d}, 'experience', experience_years::text, COUNT(*)::int
        FROM "jobs" WHERE ${win} AND experience_years IS NOT NULL
        GROUP BY experience_years
      `),

      ...TAG_COLS.map((tag) => {
        const col = Prisma.raw(`"${tag}"`);
        return prisma.$executeRaw(Prisma.sql`
          INSERT INTO stats_daily_tag (day,tag_type,tag,cnt)
          SELECT ${d}, ${tag}, t.value, COUNT(*)::int
          FROM "jobs" j, LATERAL unnest(j.${col}) AS t(value)
          WHERE ${win}
          GROUP BY t.value
        `);
      }),

      prisma.$executeRaw(Prisma.sql`
        INSERT INTO stats_dow_hour (day,dow,hour,cnt)
        SELECT ${d}, EXTRACT(DOW FROM extracted_date)::int, EXTRACT(HOUR FROM extracted_date)::int, COUNT(*)::int
        FROM "jobs" WHERE ${win}
        GROUP BY 2, 3
      `),
    ]);
  }
}

/** Post-ingest counts, for logging. */
export async function rollupStats(): Promise<{ days: number; total: number }> {
  const [row] = await prisma.$queryRaw<{ days: number; total: number }[]>(
    Prisma.sql`SELECT COUNT(*)::int AS days, COALESCE(SUM(total),0)::int AS total FROM stats_daily`,
  );
  return { days: row?.days ?? 0, total: row?.total ?? 0 };
}

/**
 * Refresh today + the previous (n-1) posting days — called after each ingest.
 * Wider than 1-2 days because a freshly-scraped job may have been *posted* days
 * earlier (posted_date is out-of-order vs scrape time).
 */
export async function refreshRecent(nDays = 35): Promise<void> {
  const days: string[] = [];
  for (let i = 0; i < nDays; i++) {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }
  await refreshDays(days);
  await prisma.$executeRaw`INSERT INTO stats_meta (key,val) VALUES ('ready','1')
    ON CONFLICT (key) DO UPDATE SET val = '1'`;
  invalidateReady();
}

/** Full set-based rebuild over every day present — run once after a bulk import. */
export async function rebuildAll(): Promise<void> {
  await ensureRollupTables();
  const win = Prisma.sql`shared_to_stats = true`;

  await prisma.$transaction([
    prisma.$executeRaw`TRUNCATE stats_daily, stats_daily_dim, stats_daily_tag, stats_dow_hour`,

    prisma.$executeRaw(Prisma.sql`
      INSERT INTO stats_daily (day,total,with_salary,salary_sum,salary_cnt,salary_min,salary_max,r0,r30,r50,r75,r100,r150)
      WITH j AS (SELECT posted_date::date AS day, ${MID} AS mid, (salary_min IS NOT NULL OR salary_max IS NOT NULL) AS has_sal FROM "jobs" WHERE ${win})
      SELECT day, COUNT(*)::int,
        COUNT(*) FILTER (WHERE has_sal)::int,
        COALESCE(SUM(mid) FILTER (WHERE mid IS NOT NULL), 0),
        COUNT(*) FILTER (WHERE mid IS NOT NULL)::int,
        MIN(mid), MAX(mid),
        COUNT(*) FILTER (WHERE mid < 30000)::int,
        COUNT(*) FILTER (WHERE mid >= 30000 AND mid < 50000)::int,
        COUNT(*) FILTER (WHERE mid >= 50000 AND mid < 75000)::int,
        COUNT(*) FILTER (WHERE mid >= 75000 AND mid < 100000)::int,
        COUNT(*) FILTER (WHERE mid >= 100000 AND mid < 150000)::int,
        COUNT(*) FILTER (WHERE mid >= 150000)::int
      FROM j GROUP BY day
    `),

    ...SCALAR_DIMS.map((dim) => {
      const col = Prisma.raw(`"${dim}"`);
      return prisma.$executeRaw(Prisma.sql`
        INSERT INTO stats_daily_dim (day,dim,val,cnt)
        SELECT posted_date::date, ${dim}, ${col}, COUNT(*)::int
        FROM "jobs" WHERE ${win} AND ${col} IS NOT NULL
        GROUP BY 1, ${col}
      `);
    }),
    prisma.$executeRaw(Prisma.sql`
      INSERT INTO stats_daily_dim (day,dim,val,cnt)
      SELECT posted_date::date, 'experience', experience_years::text, COUNT(*)::int
      FROM "jobs" WHERE ${win} AND experience_years IS NOT NULL
      GROUP BY 1, experience_years
    `),

    ...TAG_COLS.map((tag) => {
      const col = Prisma.raw(`"${tag}"`);
      return prisma.$executeRaw(Prisma.sql`
        INSERT INTO stats_daily_tag (day,tag_type,tag,cnt)
        SELECT j.posted_date::date, ${tag}, t.value, COUNT(*)::int
        FROM "jobs" j, LATERAL unnest(j.${col}) AS t(value)
        WHERE ${win}
        GROUP BY 1, t.value
      `);
    }),

    prisma.$executeRaw(Prisma.sql`
      INSERT INTO stats_dow_hour (day,dow,hour,cnt)
      SELECT posted_date::date, EXTRACT(DOW FROM extracted_date)::int, EXTRACT(HOUR FROM extracted_date)::int, COUNT(*)::int
      FROM "jobs" WHERE ${win}
      GROUP BY 1, 2, 3
    `),

    prisma.$executeRaw`INSERT INTO stats_meta (key,val) VALUES ('ready','1')
      ON CONFLICT (key) DO UPDATE SET val = '1'`,
  ]);
  invalidateReady();
}

// ---- reads (day-window over the rollups) -------------------------------------

function dayWindow(from?: Date, to?: Date): Prisma.Sql {
  const c: Prisma.Sql[] = [];
  if (from) c.push(Prisma.sql`day >= ${from}::date`);
  if (to) c.push(Prisma.sql`day < ${to}::date`);
  return c.length ? Prisma.sql`WHERE ${Prisma.join(c, " AND ")}` : Prisma.empty;
}

export async function rollupSummary(from?: Date, to?: Date) {
  const [row] = await prisma.$queryRaw<{ total: number; with_salary: number }[]>(Prisma.sql`
    SELECT COALESCE(SUM(total),0)::int AS total, COALESCE(SUM(with_salary),0)::int AS with_salary
    FROM stats_daily ${dayWindow(from, to)}
  `);
  return { total: row?.total ?? 0, withSalary: row?.with_salary ?? 0 };
}

async function facetFromDim(dim: string, from: Date | undefined, to: Date | undefined, limit: number): Promise<Facet> {
  const c: Prisma.Sql[] = [Prisma.sql`dim = ${dim}`];
  if (from) c.push(Prisma.sql`day >= ${from}::date`);
  if (to) c.push(Prisma.sql`day < ${to}::date`);
  const rows = await prisma.$queryRaw<{ val: string; c: number }[]>(Prisma.sql`
    SELECT val, SUM(cnt)::int AS c FROM stats_daily_dim
    WHERE ${Prisma.join(c, " AND ")}
    GROUP BY val ORDER BY c DESC LIMIT ${limit}
  `);
  const out: Facet = {};
  for (const r of rows) if (r.val) out[r.val] = r.c;
  return out;
}

export function rollupScalar(dim: string, from: Date | undefined, to: Date | undefined, limit: number) {
  return facetFromDim(dim, from, to, limit);
}

export async function rollupTag(tagType: string, from: Date | undefined, to: Date | undefined, limit: number): Promise<Facet> {
  const c: Prisma.Sql[] = [Prisma.sql`tag_type = ${tagType}`];
  if (from) c.push(Prisma.sql`day >= ${from}::date`);
  if (to) c.push(Prisma.sql`day < ${to}::date`);
  const rows = await prisma.$queryRaw<{ tag: string; c: number }[]>(Prisma.sql`
    SELECT tag, SUM(cnt)::int AS c FROM stats_daily_tag
    WHERE ${Prisma.join(c, " AND ")}
    GROUP BY tag ORDER BY c DESC LIMIT ${limit}
  `);
  const out: Facet = {};
  for (const r of rows) out[r.tag] = r.c;
  return out;
}

export async function rollupExperience(from?: Date, to?: Date): Promise<Facet> {
  const c: Prisma.Sql[] = [Prisma.sql`dim = 'experience'`];
  if (from) c.push(Prisma.sql`day >= ${from}::date`);
  if (to) c.push(Prisma.sql`day < ${to}::date`);
  const rows = await prisma.$queryRaw<{ val: string; c: number }[]>(Prisma.sql`
    SELECT val, SUM(cnt)::int AS c FROM stats_daily_dim
    WHERE ${Prisma.join(c, " AND ")}
    GROUP BY val ORDER BY val::int ASC
  `);
  const out: Facet = {};
  for (const r of rows) out[r.val] = r.c;
  return out;
}

export async function rollupTimeline(seriesCol: string | null, from?: Date, to?: Date) {
  if (seriesCol) {
    const c: Prisma.Sql[] = [Prisma.sql`dim = ${seriesCol}`];
    if (from) c.push(Prisma.sql`day >= ${from}::date`);
    if (to) c.push(Prisma.sql`day < ${to}::date`);
    const rows = await prisma.$queryRaw<{ d: string; k: string; c: number }[]>(Prisma.sql`
      SELECT to_char(day,'YYYY-MM-DD') AS d, val AS k, SUM(cnt)::int AS c FROM stats_daily_dim
      WHERE ${Prisma.join(c, " AND ")}
      GROUP BY day, val ORDER BY day ASC
    `);
    return { series: seriesCol, points: rows };
  }
  const rows = await prisma.$queryRaw<{ d: string; c: number }[]>(Prisma.sql`
    SELECT to_char(day,'YYYY-MM-DD') AS d, total AS c FROM stats_daily ${dayWindow(from, to)} ORDER BY day ASC
  `);
  return { series: null, points: rows };
}

export function rollupHeatmap(from?: Date, to?: Date) {
  return prisma.$queryRaw<{ dow: number; hour: number; c: number }[]>(Prisma.sql`
    SELECT dow, hour, SUM(cnt)::int AS c FROM stats_dow_hour ${dayWindow(from, to)}
    GROUP BY dow, hour ORDER BY dow, hour
  `);
}

export function rollupHourly(from?: Date, to?: Date) {
  return prisma.$queryRaw<{ hour: number; c: number }[]>(Prisma.sql`
    SELECT hour, SUM(cnt)::int AS c FROM stats_dow_hour ${dayWindow(from, to)}
    GROUP BY hour ORDER BY hour
  `);
}

/** Histogram-interpolated median from the 6 salary range buckets (no fact scan). */
function estimateMedian(buckets: [number, number, number][], total: number): number | null {
  if (!total) return null;
  const target = total / 2;
  let cum = 0;
  for (const [lo, hi, c] of buckets) {
    if (cum + c >= target) {
      const within = (target - cum) / (c || 1);
      const top = Number.isFinite(hi) ? hi : lo * 1.5;
      return Math.round(lo + within * (top - lo));
    }
    cum += c;
  }
  return null;
}

export async function rollupSalary(from?: Date, to?: Date) {
  const [agg] = await prisma.$queryRaw<
    {
      salary_sum: number; salary_cnt: number; smin: number | null; smax: number | null;
      r0: number; r30: number; r50: number; r75: number; r100: number; r150: number; with_salary: number;
    }[]
  >(Prisma.sql`
    SELECT COALESCE(SUM(salary_sum),0) AS salary_sum, COALESCE(SUM(salary_cnt),0)::int AS salary_cnt,
           MIN(salary_min) AS smin, MAX(salary_max) AS smax,
           COALESCE(SUM(r0),0)::int AS r0, COALESCE(SUM(r30),0)::int AS r30, COALESCE(SUM(r50),0)::int AS r50,
           COALESCE(SUM(r75),0)::int AS r75, COALESCE(SUM(r100),0)::int AS r100, COALESCE(SUM(r150),0)::int AS r150,
           COALESCE(SUM(with_salary),0)::int AS with_salary
    FROM stats_daily ${dayWindow(from, to)}
  `);

  const byCurrency = await facetFromDim("salary_currency", from, to, 20);
  const salaryRanges: Facet = {
    "0-30k": agg?.r0 ?? 0,
    "30-50k": agg?.r30 ?? 0,
    "50-75k": agg?.r50 ?? 0,
    "75-100k": agg?.r75 ?? 0,
    "100-150k": agg?.r100 ?? 0,
    "150k+": agg?.r150 ?? 0,
  };
  const cnt = agg?.salary_cnt ?? 0;
  const avg = cnt ? Math.round((agg!.salary_sum ?? 0) / cnt) : null;
  const median = estimateMedian(
    [
      [0, 30000, agg?.r0 ?? 0],
      [30000, 50000, agg?.r30 ?? 0],
      [50000, 75000, agg?.r50 ?? 0],
      [75000, 100000, agg?.r75 ?? 0],
      [100000, 150000, agg?.r100 ?? 0],
      [150000, Infinity, agg?.r150 ?? 0],
    ],
    cnt,
  );

  return {
    totalWithSalary: agg?.with_salary ?? 0,
    averageSalary: avg,
    medianSalary: median,
    minSalary: agg?.smin ?? null,
    maxSalary: agg?.smax ?? null,
    salaryRanges,
    byCurrency,
  };
}
