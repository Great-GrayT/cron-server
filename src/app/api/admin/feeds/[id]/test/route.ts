import { NextResponse } from "next/server";
import { prisma } from "@/db/client";
import { requireAdmin } from "@/lib/FUNC-current-user";
import { testFeedFetch } from "@/core/workers/run-user";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** POST /api/admin/feeds/{id}/test — test any user's feed (admin only). */
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(req);
  if ("response" in auth) return auth.response;
  const { id } = await params;
  const feed = await prisma.feed.findUnique({ where: { id }, select: { userId: true } });
  if (!feed) return NextResponse.json({ error: "feed not found" }, { status: 404 });
  const result = await testFeedFetch(feed.userId, id);
  return NextResponse.json(result, { status: result.ok ? 200 : 422 });
}
