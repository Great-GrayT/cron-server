import { NextRequest, NextResponse } from "next/server";
import { ingestStatsFromRss } from "@/core/workers/stats-ingest";
import { parseFilters } from "@/lib/FUNC-stats-filters";
import * as stats from "@/db/FUNC-stats-repo";
import { logger } from "@/lib/logger";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

/**
 * GET /api/stats/get  (legacy single-tenant trigger)
 *
 * Ingests the env stats feeds (system account) into Postgres and returns a
 * public-scope summary. Superseded by /api/cron/tick + /api/v1/stats/*; kept for
 * the existing external cron until it's pointed at the tick endpoint.
 */
export async function GET(_request: NextRequest) {
  try {
    const ingest = await ingestStatsFromRss();
    const publicFilters = parseFilters(new URLSearchParams("limit=5"));
    const summary = await stats.summary(publicFilters);

    if (ingest.newJobs === 0) {
      return NextResponse.json({
        success: true,
        message: `Processed ${ingest.processed} jobs, added 0 new jobs (short-circuit)`,
        processed: ingest.processed,
        newJobs: 0,
        skippedKnown: ingest.skippedKnown,
        summary: { totalJobsAllTime: summary.total, withSalary: summary.withSalary, storageBackend: "postgres" },
      });
    }

    const [industries, certificates, keywords, seniority, regions, countries] = await Promise.all([
      stats.facetScalar("industry", publicFilters),
      stats.facetArray("certificates", publicFilters),
      stats.facetArray("keywords", publicFilters),
      stats.facetScalar("seniority", publicFilters),
      stats.facetScalar("region", publicFilters),
      stats.facetScalar("country", publicFilters),
    ]);

    return NextResponse.json({
      success: true,
      message: `Processed ${ingest.processed} jobs, added ${ingest.newJobs} new jobs`,
      processed: ingest.processed,
      newJobs: ingest.newJobs,
      summary: { totalJobsAllTime: summary.total, withSalary: summary.withSalary, storageBackend: "postgres" },
      topStats: { industries, certificates, keywords, seniority, regions, countries },
    });
  } catch (error) {
    logger.error("Error fetching statistics:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics", message: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    );
  }
}
