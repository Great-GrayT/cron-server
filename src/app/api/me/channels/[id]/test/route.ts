import { NextResponse } from "next/server";
import { requireUser } from "@/lib/FUNC-current-user";
import { testChannelConnection } from "@/core/workers/run-user";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** POST /api/me/channels/{id}/test — verify the bot + post a test message. */
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireUser(req);
  if ("response" in auth) return auth.response;
  const { id } = await params;
  const result = await testChannelConnection(auth.user.sub, id);
  return NextResponse.json(result, { status: result.ok ? 200 : 422 });
}
