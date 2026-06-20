import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { parseFilters, type StatsFilters } from "@/lib/FUNC-stats-filters";
import * as stats from "@/db/FUNC-stats-repo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/v1/stats/{metric}
 *
 * One filter-aware endpoint per stats-page component. Every metric accepts the
 * shared filters (date/month, scalar facets, tag facets, free-text `q`) and
 * `limit`. Each chart calls its own URL so the frontend never pulls one giant
 * payload.
 *
 *   summary | options | industries | seniority | roles | role-types | employers
 *   | locations | skills | keywords | certifications | software | programming
 *   | degrees | timeline (?series=) | heatmap | hourly | salary
 */
const HANDLERS: Record<string, (f: StatsFilters, req: NextRequest) => Promise<unknown>> = {
  summary: (f) => stats.summary(f),
  options: () => stats.filterOptions(),
  industries: (f) => stats.facetScalar("industry", f),
  seniority: (f) => stats.facetScalar("seniority", f),
  roles: (f) => stats.facetScalar("roleCategory", f),
  "role-types": (f) => stats.facetScalar("roleType", f),
  employers: (f) => stats.facetScalar("company", f),
  locations: (f) => stats.locations(f),
  skills: (f) => stats.skills(f),
  keywords: (f) => stats.facetArray("keywords", f),
  certifications: (f) => stats.facetArray("certificates", f),
  software: (f) => stats.facetArray("software", f),
  programming: (f) => stats.facetArray("programmingSkills", f),
  degrees: (f) => stats.facetArray("academicDegrees", f),
  experience: (f) => stats.facetExperience(f),
  timeline: (f, req) => stats.timeline(f, req.nextUrl.searchParams.get("series") ?? undefined),
  heatmap: (f) => stats.heatmap(f),
  hourly: (f) => stats.hourly(f),
  salary: (f) => stats.salary(f),
};

export async function GET(req: NextRequest, { params }: { params: Promise<{ metric: string }> }) {
  const { metric } = await params;
  const handler = HANDLERS[metric];
  if (!handler) {
    return NextResponse.json(
      { error: "unknown metric", metric, available: Object.keys(HANDLERS) },
      { status: 404 },
    );
  }

  try {
    const filters = parseFilters(req.nextUrl.searchParams);
    const data = await handler(filters, req);
    return NextResponse.json(
      { success: true, metric, data },
      { headers: { "Cache-Control": "public, max-age=30" } },
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: "invalid filters", issues: error.issues }, { status: 400 });
    }
    return NextResponse.json(
      { error: "stats query failed", message: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    );
  }
}
