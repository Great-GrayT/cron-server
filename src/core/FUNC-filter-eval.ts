import type { JobStatistic } from "@/types/stats";

/**
 * JFS (Job Filtering System) evaluation.
 *
 * A filter set is a list of conditions evaluated LEFT-TO-RIGHT: each condition's
 * `connector` joins it to the NEXT one ("AND"|"OR"), left-associative. A job
 * matches the user's JFS if it matches ANY enabled set (OR across sets); matched
 * jobs go to the user's "filtered" Telegram channel.
 */

export interface Condition {
  field: string;
  op: string; // is | has | contains | gte | lte
  value: string;
  connector: string; // AND | OR — joins to the NEXT condition
  position?: number;
}

export interface FilterSetData {
  enabled?: boolean;
  conditions: Condition[];
}

const eq = (a: string | null | undefined, b: string) => (a ?? "").toLowerCase() === b.toLowerCase();
const has = (arr: string[] | undefined, v: string) =>
  (arr ?? []).some((x) => x.toLowerCase() === v.toLowerCase());
const contains = (a: string | null | undefined, b: string) =>
  (a ?? "").toLowerCase().includes(b.toLowerCase());

function evalCondition(job: JobStatistic, c: Condition): boolean {
  const v = c.value;
  switch (c.field) {
    case "industry": return eq(job.industry, v);
    case "seniority": return eq(job.seniority, v);
    case "roleCategory": return eq(job.roleCategory, v);
    case "roleType": return eq(job.roleType, v);
    case "country": return eq(job.country, v);
    case "region": return eq(job.region, v);
    case "company": return c.op === "contains" ? contains(job.company, v) : eq(job.company, v);
    case "title": return contains(job.title, v);
    case "certificate": return has(job.certificates, v);
    case "keyword": return has(job.keywords, v);
    case "software": return has(job.software, v);
    case "programming": return has(job.programmingSkills, v);
    case "experience": {
      const y = job.experienceYears;
      if (y === null || y === undefined) return false;
      const n = Number(v);
      return c.op === "lte" ? y <= n : y >= n;
    }
    case "salary": {
      const n = Number(v);
      const min = job.salary?.min ?? null;
      const max = job.salary?.max ?? null;
      if (min === null && max === null) return false;
      return c.op === "lte" ? (min ?? max)! <= n : (max ?? min)! >= n;
    }
    default:
      return false;
  }
}

/** Evaluate one set left-to-right. Empty set never matches. */
export function evalFilterSet(job: JobStatistic, conditions: Condition[]): boolean {
  if (conditions.length === 0) return false;
  const ordered = [...conditions].sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
  let acc = evalCondition(job, ordered[0]);
  for (let i = 1; i < ordered.length; i++) {
    const connector = (ordered[i - 1].connector || "AND").toUpperCase();
    const cur = evalCondition(job, ordered[i]);
    acc = connector === "OR" ? acc || cur : acc && cur;
  }
  return acc;
}

/** A job matches the JFS if it matches ANY enabled set. */
export function matchesAnyFilterSet(job: JobStatistic, sets: FilterSetData[]): boolean {
  return sets.some((s) => (s.enabled ?? true) && evalFilterSet(job, s.conditions));
}
