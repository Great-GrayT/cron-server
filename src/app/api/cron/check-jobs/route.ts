import { NextRequest, NextResponse } from "next/server";
import { checkAndSendJobs, defaultMainConfig } from "@/core/workers/job-monitor";
import { validateEnvironmentVariables, verifyCronRequest } from "@/lib/validation";
import { refreshRecent } from "@/db/FUNC-stats-rollup";
import { logger } from "@/lib/logger";

/**
 * GET /api/cron/check-jobs
 *
 * Main pipeline: fetch RSS feeds, analyse, and notify Telegram (+ GOAT channel).
 * Called by the external cron service. Bearer-protected via CRON_SECRET.
 */
export const runtime = "nodejs"; // Prisma + node:crypto — not the edge runtime
export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!verifyCronRequest(authHeader)) {
    logger.warn("Unauthorized cron request attempt");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    validateEnvironmentVariables();
    logger.info("Cron job started");

    const result = await checkAndSendJobs(defaultMainConfig());

    // Incrementally refresh the public stats rollups for the days just ingested.
    try {
      await refreshRecent();
    } catch (e) {
      logger.warn("stats rollup refresh failed (non-fatal)", e);
    }

    logger.info("Cron job completed successfully", result);
    return NextResponse.json({ success: true, timestamp: new Date().toISOString(), ...result });
  } catch (error) {
    logger.error("Cron job error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const errorName = error instanceof Error ? error.name : "Error";
    return NextResponse.json(
      { error: errorMessage, errorType: errorName, timestamp: new Date().toISOString() },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  return GET(request);
}
