import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/FUNC-current-user";
import { rebuildAll } from "@/db/FUNC-stats-rollup";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

/**
 * POST /api/admin/stats/rebuild — full set-based rebuild of the stats rollups
 * from raw jobs. Run once after a bulk import (e.g. g2); ongoing updates happen
 * incrementally on each check-jobs tick.
 */
export async function POST(req: Request) {
  const auth = await requireAdmin(req);
  if ("response" in auth) return auth.response;
  try {
    const started = Date.now();
    await rebuildAll();
    return NextResponse.json({ ok: true, ms: Date.now() - started });
  } catch (error) {
    return NextResponse.json(
      { error: "rebuild failed", message: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    );
  }
}
