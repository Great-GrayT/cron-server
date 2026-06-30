import { NextResponse } from "next/server";
import { z, ZodError } from "zod";
import { prisma } from "@/db/client";
import { requireUser } from "@/lib/FUNC-current-user";
import { hashPassword, verifyPassword } from "@/lib/FUNC-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({
  password: z.string().min(8, "min 8 characters").max(200),
  currentPassword: z.string().max(200).optional(),
});

/**
 * POST /api/auth/set-password — set or change the logged-in user's password.
 * - Account has no password yet (OAuth-only): sets it, no currentPassword needed.
 * - Account already has a password: requires a matching currentPassword.
 */
export async function POST(req: Request) {
  const auth = requireUser(req);
  if ("response" in auth) return auth.response;
  try {
    const { password, currentPassword } = schema.parse(await req.json());
    const user = await prisma.user.findUnique({
      where: { id: auth.user.sub },
      select: { passwordHash: true },
    });
    if (!user) return NextResponse.json({ error: "user not found" }, { status: 404 });

    if (user.passwordHash) {
      if (!currentPassword || !verifyPassword(currentPassword, user.passwordHash)) {
        return NextResponse.json({ error: "current password is incorrect" }, { status: 400 });
      }
    }

    await prisma.user.update({
      where: { id: auth.user.sub },
      data: { passwordHash: hashPassword(password) },
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: "invalid input", issues: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "failed to set password" }, { status: 500 });
  }
}
