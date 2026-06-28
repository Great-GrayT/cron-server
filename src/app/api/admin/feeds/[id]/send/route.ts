import { NextResponse } from "next/server";
import { prisma } from "@/db/client";
import { requireAdmin } from "@/lib/FUNC-current-user";
import { sendFeedNow } from "@/core/workers/run-user";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;

/** POST /api/admin/feeds/{id}/send — send any user's feed to their Telegram + DB. */
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(req);
  if ("response" in auth) return auth.response;
  const { id } = await params;
  const feed = await prisma.feed.findUnique({ where: { id }, select: { userId: true } });
  if (!feed) return NextResponse.json({ error: "feed not found" }, { status: 404 });
  const result = await sendFeedNow(feed.userId, id);
  return NextResponse.json(result, { status: result.ok ? 200 : 422 });
}
