import { NextResponse } from "next/server";
import { requireUser } from "@/lib/FUNC-current-user";
import { listApplied, appliedStats, clearApplied } from "@/db/FUNC-applied-repo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/me/applied?month=YYYY-MM
 *
 * The current user's applied jobs (clicked "Apply here" tracking links) + stats.
 */
export async function GET(req: Request) {
  const auth = requireUser(req);
  if ("response" in auth) return auth.response;
  const month = new URL(req.url).searchParams.get("month") || undefined;
  try {
    const [data, stats] = await Promise.all([
      listApplied(auth.user.sub, month),
      appliedStats(auth.user.sub),
    ]);
    return NextResponse.json({ success: true, data, stats, filter: { month: month ?? null } });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "failed to fetch applied jobs", message: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    );
  }
}

/** DELETE /api/me/applied — clear all of the user's applications. */
export async function DELETE(req: Request) {
  const auth = requireUser(req);
  if ("response" in auth) return auth.response;
  const removed = await clearApplied(auth.user.sub);
  return NextResponse.json({ ok: true, removed });
}
