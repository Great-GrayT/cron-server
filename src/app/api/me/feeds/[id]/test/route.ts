import { NextResponse } from "next/server";
import { requireUser } from "@/lib/FUNC-current-user";
import { testFeedFetch } from "@/core/workers/run-user";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** POST /api/me/feeds/{id}/test — fetch the feed + report item count/errors. */
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireUser(req);
  if ("response" in auth) return auth.response;
  const { id } = await params;
  const result = await testFeedFetch(auth.user.sub, id);
  return NextResponse.json(result, { status: result.ok ? 200 : 422 });
}
