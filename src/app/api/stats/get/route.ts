import { NextRequest, NextResponse } from "next/server";
import { ingestStatsFromRss } from "@/core/workers/stats-ingest";
import { getJobCounts, getAggregatedTopStats } from "@/db/FUNC-jobs-repo";
import { logger } from "@/lib/logger";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

/**
 * GET /api/stats/get
 *
 * Ingests new jobs from the stats RSS feeds into Postgres, then returns summary
 * statistics aggregated across all stored jobs. (Replaces the old R2/Gist read;
 * the per-component stats APIs build on the same Postgres tables.)
 */
export async function GET(_request: NextRequest) {
  try {
    const ingest = await ingestStatsFromRss();
    const counts = await getJobCounts();

    // Short-circuit: nothing new → skip the heavier aggregation pass.
    if (ingest.newJobs === 0) {
      return NextResponse.json({
        success: true,
        message: `Processed ${ingest.processed} jobs, added 0 new jobs (short-circuit)`,
        processed: ingest.processed,
        newJobs: 0,
        skippedKnown: ingest.skippedKnown,
        summary: {
          totalJobsAllTime: counts.total,
          currentMonthJobs: counts.currentMonth,
          storageBackend: "postgres",
        },
      });
    }

    const topStats = await getAggregatedTopStats(5);

    return NextResponse.json({
      success: true,
      message: `Processed ${ingest.processed} jobs, added ${ingest.newJobs} new jobs`,
      processed: ingest.processed,
      newJobs: ingest.newJobs,
      summary: {
        totalJobsAllTime: counts.total,
        currentMonthJobs: counts.currentMonth,
        storageBackend: "postgres",
      },
      topStats,
    });
  } catch (error) {
    logger.error("Error fetching statistics:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics", message: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    );
  }
}
