import { NextResponse } from "next/server";
import { prisma } from "@/db/client";
import { requireAdmin } from "@/lib/FUNC-current-user";
import { testChannelConnection } from "@/core/workers/run-user";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** POST /api/admin/channels/{id}/test — test any user's Telegram channel. */
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(req);
  if ("response" in auth) return auth.response;
  const { id } = await params;
  const ch = await prisma.notificationChannel.findUnique({ where: { id }, select: { userId: true } });
  if (!ch) return NextResponse.json({ error: "channel not found" }, { status: 404 });
  const result = await testChannelConnection(ch.userId, id);
  return NextResponse.json(result, { status: result.ok ? 200 : 422 });
}
