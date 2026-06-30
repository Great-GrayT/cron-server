import { NextResponse } from "next/server";
import { prisma } from "@/db/client";
import { requireUser, requireAdmin } from "@/lib/FUNC-current-user";
import { markRead, deleteMessage } from "@/db/FUNC-messages-repo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** PATCH /api/me/messages/{id} — mark a received message read. */
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireUser(req);
  if ("response" in auth) return auth.response;
  const { id } = await params;
  const u = await prisma.user.findUnique({ where: { id: auth.user.sub }, select: { role: true } });
  const count = await markRead(auth.user.sub, u?.role === "admin", id);
  return NextResponse.json({ ok: count > 0 });
}

/** DELETE /api/me/messages/{id} — admin-only hard delete of any message. */
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(req);
  if ("response" in auth) return auth.response;
  const { id } = await params;
  const count = await deleteMessage(id);
  return NextResponse.json({ ok: count > 0 });
}
