import { NextResponse } from "next/server";
import { prisma } from "@/db/client";
import { consumeAuthToken } from "@/lib/FUNC-auth-tokens";
import { frontendUrl } from "@/lib/FUNC-account";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/auth/verify-email?token=...
 * Target of the emailed verification link. Marks the email verified and bounces
 * back to the frontend's /auth/verified page with the outcome.
 */
export async function GET(req: Request) {
  const token = new URL(req.url).searchParams.get("token") ?? "";
  const userId = await consumeAuthToken(token, "email_verify");
  if (!userId) {
    return NextResponse.redirect(`${frontendUrl()}/auth/verified?ok=0`);
  }
  await prisma.user.update({ where: { id: userId }, data: { emailVerified: true } });
  return NextResponse.redirect(`${frontendUrl()}/auth/verified?ok=1`);
}
