import { NextResponse } from "next/server";
import { prisma } from "@/db/client";
import { requireUser } from "@/lib/FUNC-current-user";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** GET /api/auth/me — current account profile (requires Bearer JWT). */
export async function GET(req: Request) {
  const auth = requireUser(req);
  if ("response" in auth) return auth.response;

  const user = await prisma.user.findUnique({
    where: { id: auth.user.sub },
    select: { id: true, email: true, name: true, role: true, createdAt: true },
  });
  if (!user) return NextResponse.json({ error: "user not found" }, { status: 404 });
  return NextResponse.json({ user });
}
