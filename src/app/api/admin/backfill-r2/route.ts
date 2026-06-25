import { NextRequest, NextResponse } from "next/server";
import { verifyCronRequest } from "@/lib/validation";
import { backfillFromR2 } from "@/core/workers/backfill-r2";
import { logger } from "@/lib/logger";

/**
 * POST /api/admin/backfill-r2  (one-time g2 import)
 *
 * Bearer-protected (CRON_SECRET). Imports historical jobs from the old R2 store
 * into Postgres. Idempotent — re-running skips jobs already imported. Requires
 * the R2_* env vars to be set.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function POST(req: NextRequest) {
  if (!verifyCronRequest(req.headers.get("authorization"))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const result = await backfillFromR2();
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    logger.error("backfill-r2 failed", error);
    return NextResponse.json(
      { error: "backfill failed", message: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    );
  }
}
