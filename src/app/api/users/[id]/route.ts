import { NextResponse } from "next/server";
import { prisma } from "@/db/client";
import { requireUser } from "@/lib/FUNC-current-user";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/users/{id} — a small public "contact card" for any authenticated user.
 * Used by the chat to show a partner's name / username / email / address. Sensitive
 * fields (phone, bans, etc.) are intentionally omitted — admins use /api/admin/users.
 */
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireUser(req);
  if ("response" in auth) return auth.response;
  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
      firstName: true,
      lastName: true,
      country: true,
      city: true,
      speciality: true,
      avatarUrl: true,
      avatarData: true,
      role: true,
    },
  });
  if (!user) return NextResponse.json({ error: "user not found" }, { status: 404 });
  return NextResponse.json({ user });
}
