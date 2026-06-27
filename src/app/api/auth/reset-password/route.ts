import { NextResponse } from "next/server";
import { z, ZodError } from "zod";
import { prisma } from "@/db/client";
import { hashPassword } from "@/lib/FUNC-auth";
import { consumeAuthToken } from "@/lib/FUNC-auth-tokens";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({ token: z.string().min(1), password: z.string().min(8).max(200) });

/** POST /api/auth/reset-password — set a new password from a reset token. */
export async function POST(req: Request) {
  try {
    const { token, password } = schema.parse(await req.json());
    const userId = await consumeAuthToken(token, "password_reset");
    if (!userId) {
      return NextResponse.json({ error: "invalid or expired token" }, { status: 400 });
    }
    // A successful reset also confirms email ownership.
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: hashPassword(password), emailVerified: true },
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: "invalid input", issues: error.issues }, { status: 400 });
    }
    return NextResponse.json(
      { error: "reset failed", message: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    );
  }
}
