import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { parseFilters, type StatsFilters } from "@/lib/FUNC-stats-filters";
import { getUser } from "@/lib/FUNC-current-user";
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
type Handler = (f: StatsFilters, userId: string | undefined, req: NextRequest) => Promise<unknown>;

const HANDLERS: Record<string, Handler> = {
  summary: (f, u) => stats.summary(f, u),
  options: () => stats.filterOptions(),
  industries: (f, u) => stats.facetScalar("industry", f, u),
  seniority: (f, u) => stats.facetScalar("seniority", f, u),
  roles: (f, u) => stats.facetScalar("roleCategory", f, u),
  "role-types": (f, u) => stats.facetScalar("roleType", f, u),
  employers: (f, u) => stats.facetScalar("company", f, u),
  locations: (f, u) => stats.locations(f, u),
  skills: (f, u) => stats.skills(f, u),
  keywords: (f, u) => stats.facetArray("keywords", f, u),
  certifications: (f, u) => stats.facetArray("certificates", f, u),
  software: (f, u) => stats.facetArray("software", f, u),
  programming: (f, u) => stats.facetArray("programmingSkills", f, u),
  degrees: (f, u) => stats.facetArray("academicDegrees", f, u),
  experience: (f, u) => stats.facetExperience(f, u),
  timeline: (f, u, req) => stats.timeline(f, req.nextUrl.searchParams.get("series") ?? undefined, u),
  heatmap: (f, u) => stats.heatmap(f, u),
  hourly: (f, u) => stats.hourly(f, u),
  salary: (f, u) => stats.salary(f, u),
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
    // Personal scope requires auth; public scope is open.
    let userId: string | undefined;
    if (filters.scope === "me") {
      const user = getUser(req);
      if (!user) return NextResponse.json({ error: "unauthorized (scope=me)" }, { status: 401 });
      userId = user.sub;
    }
    const data = await handler(filters, userId, req);
    const cache = filters.scope === "me" ? "private, no-store" : "public, max-age=30";
    return NextResponse.json({ success: true, metric, data }, { headers: { "Cache-Control": cache } });
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
