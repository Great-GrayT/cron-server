import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/FUNC-current-user";
import { rebuildAll, rollupStats } from "@/db/FUNC-stats-rollup";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

interface Log {
  level: "info" | "success" | "error";
  message: string;
}

/**
 * POST /api/admin/stats/rebuild — full set-based rebuild of the stats rollups
 * from raw jobs. Run once after a bulk import (e.g. g2); ongoing updates happen
 * incrementally on each check-jobs tick. Returns step logs for the admin monitor.
 */
export async function POST(req: Request) {
  const auth = await requireAdmin(req);
  if ("response" in auth) return auth.response;
  const logs: Log[] = [];
  try {
    const started = Date.now();
    logs.push({ level: "info", message: "Rebuilding stats rollups from raw jobs (set-based)…" });
    await rebuildAll();
    const { days, total } = await rollupStats();
    const ms = Date.now() - started;
    logs.push({ level: "success", message: `Built ${days} day-rollup(s) covering ${total} job(s) in ${(ms / 1000).toFixed(1)}s.` });
    return NextResponse.json({ ok: true, ms, days, total, logs });
  } catch (error) {
    logs.push({ level: "error", message: error instanceof Error ? error.message : String(error) });
    return NextResponse.json({ error: "rebuild failed", logs }, { status: 500 });
  }
}
