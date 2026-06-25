import { NextResponse } from "next/server";
import { prisma } from "@/db/client";
import { requireUser } from "@/lib/FUNC-current-user";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** DELETE /api/me/channels/{id} */
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireUser(req);
  if ("response" in auth) return auth.response;
  const { id } = await params;
  const result = await prisma.notificationChannel.deleteMany({ where: { id, userId: auth.user.sub } });
  if (result.count === 0) return NextResponse.json({ error: "channel not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
