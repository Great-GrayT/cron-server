import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { parseFilters } from "@/lib/FUNC-stats-filters";
import { jobsList } from "@/db/FUNC-stats-repo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/v1/jobs
 *
 * Paginated, filterable, searchable job list for the rss page / job table.
 * Same shared filters as the stats endpoints, plus page/pageSize/sort/order and
 * `withDescription=true`. Descriptions are omitted by default (heavy field).
 */
export async function GET(req: NextRequest) {
  try {
    const filters = parseFilters(req.nextUrl.searchParams);
    const data = await jobsList(filters);
    return NextResponse.json({ success: true, ...data });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: "invalid filters", issues: error.issues }, { status: 400 });
    }
    return NextResponse.json(
      { error: "jobs query failed", message: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    );
  }
}
