import { NextResponse } from "next/server";
import { requireUser } from "@/lib/FUNC-current-user";
import { sendFeedNow } from "@/core/workers/run-user";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;

/** POST /api/me/feeds/{id}/send — push the feed's jobs to Telegram + save to DB. */
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireUser(req);
  if ("response" in auth) return auth.response;
  const { id } = await params;
  const result = await sendFeedNow(auth.user.sub, id);
  return NextResponse.json(result, { status: result.ok ? 200 : 422 });
}
