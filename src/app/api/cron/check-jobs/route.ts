import { NextRequest, NextResponse } from "next/server";
import { checkAndSendJobs, defaultMainConfig } from "@/core/workers/job-monitor";
import { validateEnvironmentVariables, verifyCronRequest } from "@/lib/validation";
import { hoursMatch } from "@/lib/FUNC-cron";
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

  // Optional active-hours window, enforced server-side so the pipeline only runs
  // during CRON_ACTIVE_HOURS (UTC hour spec, e.g. "8-21") regardless of how the
  // external scheduler is configured. Unset = always run. Skips are 200 (not an
  // error) so the scheduler doesn't treat them as failures.
  const activeHours = process.env.CRON_ACTIVE_HOURS?.trim();
  if (activeHours && !hoursMatch(activeHours, new Date())) {
    const hour = new Date().getUTCHours();
    logger.info(`Cron skipped: hour ${hour} UTC outside active window ${activeHours}`);
    return NextResponse.json({
      success: true,
      skipped: true,
      reason: `outside active hours (${activeHours} UTC)`,
      hourUtc: hour,
      timestamp: new Date().toISOString(),
    });
  }

  try {
    validateEnvironmentVariables();
    logger.info("Cron job started");

    // The ingest inside checkAndSendJobs refreshes the rollups for exactly the
    // days it touched, so the stats page updates automatically — no separate
    // rollup pass needed here.
    const result = await checkAndSendJobs(defaultMainConfig());

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
