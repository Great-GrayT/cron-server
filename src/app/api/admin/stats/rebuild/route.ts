import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/FUNC-current-user";
import { rebuildAll, rollupStats, clampPostedDates } from "@/db/FUNC-stats-rollup";
import {
  pruneOldDescriptions,
  pruneRunHistory,
  purgeUnverifiedUsers,
} from "@/core/workers/run-user";
import { pruneExpiredSentUrls } from "@/db/FUNC-dedup-repo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

interface Log {
  level: "info" | "success" | "error";
  message: string;
}

/**
 * Selectable maintenance operations. Each returns a human log line. The canonical
 * ORDER below is enforced regardless of request order — notably clampDates must
 * run before rebuildRollups so the rollups reflect the corrected dates.
 */
const OPERATIONS: { key: string; run: () => Promise<string> }[] = [
  {
    key: "clampDates",
    run: async () => {
      const n = await clampPostedDates();
      return `Fixed ${n} out-of-range publication date(s) (before 2026 / future → now).`;
    },
  },
  {
    key: "rebuildRollups",
    run: async () => {
      await rebuildAll();
      const { days, total } = await rollupStats();
      return `Rebuilt ${days} day-rollup(s) covering ${total} job(s).`;
    },
  },
  {
    key: "pruneDescriptions",
    run: async () => `Pruned ${await pruneOldDescriptions()} old job description(s).`,
  },
  {
    key: "pruneRunHistory",
    run: async () => {
      const r = await pruneRunHistory();
      return `Pruned ${r.scheduleRuns} schedule + ${r.cronRuns} cron run record(s).`;
    },
  },
  {
    key: "purgeUnverified",
    run: async () => `Purged ${await purgeUnverifiedUsers()} unverified user(s).`,
  },
  {
    key: "pruneUrlCache",
    run: async () => `Pruned ${await pruneExpiredSentUrls()} expired sent-URL cache entr(ies).`,
  },
];

const DEFAULT_OPS = ["clampDates", "rebuildRollups"];

/**
 * POST /api/admin/stats/rebuild
 *
 * Runs a chosen set of maintenance operations. Body: `{ operations: string[] }`
 * (omit or empty → the common default: fix dates + rebuild rollups). Returns
 * per-step logs for the admin monitor.
 */
export async function POST(req: Request) {
  const auth = await requireAdmin(req);
  if ("response" in auth) return auth.response;

  const body = (await req.json().catch(() => ({}))) as { operations?: unknown };
  const requested =
    Array.isArray(body.operations) && body.operations.length
      ? body.operations.filter((o): o is string => typeof o === "string")
      : DEFAULT_OPS;

  const selected = OPERATIONS.filter((op) => requested.includes(op.key));
  if (selected.length === 0) {
    return NextResponse.json(
      { error: "no valid operations", available: OPERATIONS.map((o) => o.key) },
      { status: 400 },
    );
  }

  const logs: Log[] = [];
  const started = Date.now();
  try {
    for (const op of selected) {
      const t = Date.now();
      logs.push({ level: "info", message: `Running: ${op.key}…` });
      const message = await op.run();
      logs.push({ level: "success", message: `${message} (${((Date.now() - t) / 1000).toFixed(1)}s)` });
    }
    const ms = Date.now() - started;
    logs.push({ level: "success", message: `Done — ${selected.length} operation(s) in ${(ms / 1000).toFixed(1)}s.` });
    return NextResponse.json({ ok: true, ms, ran: selected.map((o) => o.key), logs });
  } catch (error) {
    logs.push({ level: "error", message: error instanceof Error ? error.message : String(error) });
    return NextResponse.json({ error: "rebuild failed", logs }, { status: 500 });
  }
}
