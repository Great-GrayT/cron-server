import { NextRequest, NextResponse } from "next/server";
import { verifyCronRequest } from "@/lib/validation";
import { runDueSchedules } from "@/core/workers/run-user";
import { logger } from "@/lib/logger";

/**
 * GET/POST /api/cron/tick
 *
 * The single multi-tenant cron entrypoint. The external cron service calls this
 * frequently (e.g. every minute) with `Authorization: Bearer <CRON_SECRET>`;
 * the server runs every user schedule whose interval has elapsed. Replaces the
 * per-pipeline env endpoints.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function GET(request: NextRequest) {
  if (!verifyCronRequest(request.headers.get("authorization"))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const result = await runDueSchedules();
    logger.info("cron tick complete", { ran: result.ran });
    return NextResponse.json({ success: true, timestamp: new Date().toISOString(), ...result });
  } catch (error) {
    logger.error("cron tick error", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  return GET(request);
}
