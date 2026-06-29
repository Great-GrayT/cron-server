import { NextResponse } from "next/server";
import { z, ZodError } from "zod";
import { prisma } from "@/db/client";
import { requireAdmin } from "@/lib/FUNC-current-user";
import { adminUserDetail } from "@/db/FUNC-admin-repo";

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
