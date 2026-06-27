import { NextResponse } from "next/server";
import { z, ZodError } from "zod";
import { prisma } from "@/db/client";
import { createAuthToken } from "@/lib/FUNC-auth-tokens";
import { sendPasswordResetEmail } from "@/lib/FUNC-email";
import { frontendUrl } from "@/lib/FUNC-account";
import { logger } from "@/lib/logger";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Accepts an email or username.
const schema = z.object({ identifier: z.string().min(1).max(200) });

/**
 * POST /api/auth/forgot-password — email a password-reset link.
 * Always returns 200 (no account enumeration).
 */
export async function POST(req: Request) {
  try {
    const { identifier } = schema.parse(await req.json());
    const raw = identifier.trim();
    const user = await prisma.user.findFirst({
      where: { OR: [{ email: raw.toLowerCase() }, { username: raw }] },
    });
    // Only password accounts can reset (OAuth-only accounts have no password).
    if (user && user.passwordHash) {
      const token = await createAuthToken(user.id, "password_reset");
      try {
        await sendPasswordResetEmail(user.email, `${frontendUrl()}/reset-password?token=${token}`);
      } catch (sendErr) {
        // Don't leak failure to the client, but make it visible in the logs.
        logger.error("forgot-password: email send failed", sendErr);
      }
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: "invalid input", issues: error.issues }, { status: 400 });
    }
    return NextResponse.json({ ok: true });
  }
}
