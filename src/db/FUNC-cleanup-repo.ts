import { prisma } from "@/db/client";

/**
 * Destructive dataset wipes for the admin "Clean database" action (re-import from
 * g2 after clearing). SECURITY: the set of clearable datasets and their exact
 * table lists are defined HERE as code constants — the client only ever sends a
 * dataset KEY (validated against this allowlist). No table name ever comes from
 * request input, so this cannot be turned into an arbitrary-table wipe. Account
 * data (users, feeds, channels, auth, messages, filter sets) is intentionally
 * NOT clearable here.
 */

const DATASETS = {
  // Everything the g2 backfill repopulates: raw jobs + their links + heavy text +
  // the derived stats rollups (meaningless once jobs are gone).
  jobs: {
    label: "Job data + stats",
    countTable: "jobs",
    tables: [
      "user_jobs",
      "job_descriptions",
      "stats_daily",
      "stats_daily_dim",
      "stats_daily_tag",
      "stats_dow_hour",
      "stats_meta",
      "jobs",
    ],
  },
  applied: { label: "Applied / tracking", countTable: "applied_jobs", tables: ["applied_jobs"] },
  dedup: { label: "Dedup ledger", countTable: "sent_urls", tables: ["sent_urls"] },
  backfills: { label: "Backfill history", countTable: "backfill_jobs", tables: ["backfill_jobs"] },
} as const;

export type CleanKey = keyof typeof DATASETS;
export const CLEAN_KEYS = Object.keys(DATASETS) as CleanKey[];

export interface CleanResult {
  cleared: CleanKey[];
  counts: Record<string, number>; // rows present BEFORE the wipe, per dataset
  tables: string[];
}

/**
 * TRUNCATE the tables for the given datasets (RESTART IDENTITY CASCADE). Returns
 * the pre-wipe row counts for admin feedback. Keys are re-validated against the
 * allowlist; only code-defined identifiers reach SQL.
 */
export async function cleanDatasets(keys: CleanKey[]): Promise<CleanResult> {
  const uniqueKeys = [...new Set(keys)].filter((k): k is CleanKey => k in DATASETS);
  if (uniqueKeys.length === 0) return { cleared: [], counts: {}, tables: [] };

  // Row counts before wiping (nice feedback: "cleared N jobs").
  const counts: Record<string, number> = {};
  for (const k of uniqueKeys) {
    const t = DATASETS[k].countTable; // code constant, not input
    const rows = await prisma.$queryRawUnsafe<{ c: bigint }[]>(`SELECT COUNT(*)::bigint AS c FROM "${t}"`);
    counts[k] = Number(rows[0]?.c ?? 0);
  }

  const tables = new Set<string>();
  for (const k of uniqueKeys) for (const t of DATASETS[k].tables) tables.add(t);
  const list = [...tables].map((t) => `"${t}"`).join(", "); // all code constants
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${list} RESTART IDENTITY CASCADE`);

  return { cleared: uniqueKeys, counts, tables: [...tables] };
}
