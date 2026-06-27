import { NextResponse } from "next/server";
import { z, ZodError } from "zod";
import { prisma } from "@/db/client";
import { issueVerification } from "@/lib/FUNC-account";
import { logger } from "@/lib/logger";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({ email: z.string().email().max(200) });

/**
 * POST /api/auth/resend-verification — resend the verification link.
 * Always returns 200 (no account enumeration).
 */
export async function POST(req: Request) {
  try {
    const { email } = schema.parse(await req.json());
    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    if (user && !user.emailVerified) {
      try {
        await issueVerification(user.id, user.email);
      } catch (sendErr) {
        logger.error("resend-verification: email send failed", sendErr);
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
