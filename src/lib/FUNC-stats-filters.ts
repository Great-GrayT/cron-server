import { Prisma } from "@prisma/client";
import { z } from "zod";

/**
 * Shared filter + search parsing for every stats/jobs API.
 *
 * One validated filter object drives both:
 *   - `wherePrisma()`  for Prisma groupBy/count/findMany (scalar facets)
 *   - `whereSql()`     for $queryRaw aggregations (array tags, time buckets)
 * Both build parameterised conditions — no user input is ever interpolated.
 */

const csv = (v: string) => v.split(",").map((s) => s.trim()).filter(Boolean);

const filterSchema = z.object({
  // Time window (applies to extractedDate). `month` is a YYYY-MM convenience.
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
  month: z.string().regex(/^\d{4}-\d{2}$/).optional(),

  // Scalar facets (exact match).
  industry: z.string().max(120).optional(),
  seniority: z.string().max(60).optional(),
  country: z.string().max(120).optional(),
  region: z.string().max(60).optional(),
  city: z.string().max(120).optional(),
  roleType: z.string().max(120).optional(),
  roleCategory: z.string().max(120).optional(),
  company: z.string().max(200).optional(),

  // Multi-value tag facets (job must contain the tag).
  keyword: z.string().max(80).optional(),
  certificate: z.string().max(80).optional(),
  software: z.string().max(80).optional(),
  programming: z.string().max(80).optional(),
  degree: z.string().max(80).optional(),

  // Numeric range filters.
  salaryMin: z.coerce.number().min(0).optional(),
  salaryMax: z.coerce.number().min(0).optional(),
  expMin: z.coerce.number().int().min(0).max(60).optional(),
  expMax: z.coerce.number().int().min(0).max(60).optional(),

  // Free-text search over title + company + location + description (trigram).
  q: z.string().max(200).optional(),

  // Scope: "public" = shared-to-stats union across all users (deduped by url);
  // "me" = the authenticated user's own jobs (route supplies the userId).
  scope: z.enum(["public", "me"]).default("public"),

  // Pagination / sort (jobs list).
  page: z.coerce.number().int().min(1).max(100000).default(1),
  pageSize: z.coerce.number().int().min(1).max(200).default(50),
  sort: z.enum(["postedDate", "extractedDate"]).default("postedDate"),
  order: z.enum(["asc", "desc"]).default("desc"),
  withDescription: z
    .union([z.literal("true"), z.literal("false")])
    .optional()
    .transform((v) => v === "true"),

  // Top-N for facet endpoints.
  limit: z.coerce.number().int().min(1).max(500).default(50),
});

export type StatsFilters = z.infer<typeof filterSchema>;

/** Parse + validate raw query params. Throws ZodError on invalid input. */
export function parseFilters(searchParams: URLSearchParams): StatsFilters {
  return filterSchema.parse(Object.fromEntries(searchParams.entries()));
}

/** Resolve the effective [from,to] extractedDate window. */
export function dateRange(f: StatsFilters): { from?: Date; to?: Date } {
  if (f.month) {
    const [y, m] = f.month.split("-").map(Number);
    return { from: new Date(Date.UTC(y, m - 1, 1)), to: new Date(Date.UTC(y, m, 1)) };
  }
  return { from: f.from ? new Date(f.from) : undefined, to: f.to ? new Date(f.to) : undefined };
}

/** Prisma where clause for scalar groupBy / count / findMany. */
export function wherePrisma(f: StatsFilters, userId?: string): Prisma.JobWhereInput {
  const { from, to } = dateRange(f);
  const where: Prisma.JobWhereInput = {};

  // Scope base: public union (shared jobs) vs the user's own linked jobs.
  if (f.scope === "me") where.links = { some: { userId } };
  else where.sharedToStats = true;

  if (from || to) where.extractedDate = { ...(from && { gte: from }), ...(to && { lt: to }) };
  if (f.industry) where.industry = f.industry;
  if (f.seniority) where.seniority = f.seniority;
  if (f.country) where.country = f.country;
  if (f.region) where.region = f.region;
  if (f.city) where.city = f.city;
  if (f.roleType) where.roleType = f.roleType;
  if (f.roleCategory) where.roleCategory = f.roleCategory;
  if (f.company) where.company = f.company;

  if (f.keyword) where.keywords = { has: f.keyword };
  if (f.certificate) where.certificates = { has: f.certificate };
  if (f.software) where.software = { has: f.software };
  if (f.programming) where.programmingSkills = { has: f.programming };
  if (f.degree) where.academicDegrees = { has: f.degree };

  if (f.salaryMin !== undefined) where.salaryMax = { gte: f.salaryMin };
  if (f.salaryMax !== undefined) where.salaryMin = { lte: f.salaryMax };
  if (f.expMin !== undefined || f.expMax !== undefined) {
    where.experienceYears = {
      ...(f.expMin !== undefined && { gte: f.expMin }),
      ...(f.expMax !== undefined && { lte: f.expMax }),
    };
  }

  // Word-inside-text search across all text columns (trigram-indexed ILIKE).
  if (f.q) {
    where.OR = [
      { title: { contains: f.q, mode: "insensitive" } },
      { company: { contains: f.q, mode: "insensitive" } },
      { location: { contains: f.q, mode: "insensitive" } },
      { description: { contains: f.q, mode: "insensitive" } },
    ];
  }
  return where;
}

/** Parameterised SQL WHERE fragment for $queryRaw aggregations. */
export function whereSql(f: StatsFilters, userId?: string): Prisma.Sql {
  const { from, to } = dateRange(f);
  const c: Prisma.Sql[] = [];

  // Scope base. `id` resolves to the outer jobs row regardless of its alias;
  // the subquery is uncorrelated (just the user's linked job ids).
  if (f.scope === "me")
    c.push(Prisma.sql`id IN (SELECT uj.job_id FROM "user_jobs" uj WHERE uj.user_id = ${userId}::uuid)`);
  else c.push(Prisma.sql`shared_to_stats = true`);

  if (from) c.push(Prisma.sql`extracted_date >= ${from}`);
  if (to) c.push(Prisma.sql`extracted_date < ${to}`);
  if (f.industry) c.push(Prisma.sql`industry = ${f.industry}`);
  if (f.seniority) c.push(Prisma.sql`seniority = ${f.seniority}`);
  if (f.country) c.push(Prisma.sql`country = ${f.country}`);
  if (f.region) c.push(Prisma.sql`region = ${f.region}`);
  if (f.city) c.push(Prisma.sql`city = ${f.city}`);
  if (f.roleType) c.push(Prisma.sql`role_type = ${f.roleType}`);
  if (f.roleCategory) c.push(Prisma.sql`role_category = ${f.roleCategory}`);
  if (f.company) c.push(Prisma.sql`company = ${f.company}`);

  if (f.keyword) c.push(Prisma.sql`keywords @> ARRAY[${f.keyword}]::text[]`);
  if (f.certificate) c.push(Prisma.sql`certificates @> ARRAY[${f.certificate}]::text[]`);
  if (f.software) c.push(Prisma.sql`software @> ARRAY[${f.software}]::text[]`);
  if (f.programming) c.push(Prisma.sql`programming_skills @> ARRAY[${f.programming}]::text[]`);
  if (f.degree) c.push(Prisma.sql`academic_degrees @> ARRAY[${f.degree}]::text[]`);

  if (f.salaryMin !== undefined) c.push(Prisma.sql`salary_max >= ${f.salaryMin}`);
  if (f.salaryMax !== undefined) c.push(Prisma.sql`salary_min <= ${f.salaryMax}`);
  if (f.expMin !== undefined) c.push(Prisma.sql`experience_years >= ${f.expMin}`);
  if (f.expMax !== undefined) c.push(Prisma.sql`experience_years <= ${f.expMax}`);

  if (f.q) {
    const like = `%${f.q}%`;
    c.push(
      Prisma.sql`(title ILIKE ${like} OR company ILIKE ${like} OR location ILIKE ${like} OR description ILIKE ${like})`,
    );
  }

  if (c.length === 0) return Prisma.empty;
  return Prisma.sql`WHERE ${Prisma.join(c, " AND ")}`;
}
