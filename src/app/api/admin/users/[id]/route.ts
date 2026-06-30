import { NextResponse } from "next/server";
import { z, ZodError } from "zod";
import { prisma } from "@/db/client";
import { requireAdmin } from "@/lib/FUNC-current-user";
import { verifyPassword } from "@/lib/FUNC-auth";
import { adminUserDetail, deleteUserAndReassignFeeds } from "@/db/FUNC-admin-repo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** GET /api/admin/users/{id} — full detail: feeds, channels (masked), crons, tracking. */
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(req);
  if ("response" in auth) return auth.response;
  const { id } = await params;
  const detail = await adminUserDetail(id);
  if (!detail) return NextResponse.json({ error: "user not found" }, { status: 404 });
  return NextResponse.json(detail);
}

const patchSchema = z.object({
  revokedPages: z.array(z.string().max(40)).max(50).optional(),
  role: z.enum(["user", "admin"]).optional(),
});

/** PATCH /api/admin/users/{id} — set per-page bans and/or role. */
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(req);
  if ("response" in auth) return auth.response;
  const { id } = await params;
  try {
    const data = patchSchema.parse(await req.json());

    // Don't allow demoting the last remaining admin (lockout protection).
    if (data.role === "user") {
      const target = await prisma.user.findUnique({ where: { id }, select: { role: true } });
      if (target?.role === "admin") {
        const adminCount = await prisma.user.count({ where: { role: "admin" } });
        if (adminCount <= 1) {
          return NextResponse.json({ error: "cannot demote the last admin" }, { status: 400 });
        }
      }
    }

    const user = await prisma.user.update({
      where: { id },
      data,
      select: { id: true, role: true, revokedPages: true },
    });
    return NextResponse.json({ user });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: "invalid input", issues: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "update failed" }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/users/{id} — permanently delete a user. Their RSS feeds are
 * reassigned to the oldest admin (and made public); everything else is cascaded.
 */
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(req);
  if ("response" in auth) return auth.response;
  const { id } = await params;
  if (id === auth.user.sub) {
    return NextResponse.json({ error: "you cannot delete your own account here" }, { status: 400 });
  }

  // Confirm the acting admin's own password before allowing a destructive delete.
  const body = (await req.json().catch(() => ({}))) as { password?: unknown };
  const password = typeof body.password === "string" ? body.password : "";
  const me = await prisma.user.findUnique({ where: { id: auth.user.sub }, select: { passwordHash: true } });
  if (!me?.passwordHash) {
    return NextResponse.json({ error: "set a password on your account before deleting users" }, { status: 400 });
  }
  if (!password || !verifyPassword(password, me.passwordHash)) {
    return NextResponse.json({ error: "incorrect password" }, { status: 403 });
  }

  const result = await deleteUserAndReassignFeeds(id);
  if ("error" in result) return NextResponse.json({ error: result.error }, { status: 400 });
  return NextResponse.json(result);
}
