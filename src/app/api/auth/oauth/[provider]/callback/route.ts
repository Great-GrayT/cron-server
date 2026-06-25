import { NextResponse } from "next/server";
import { prisma } from "@/db/client";
import { signJwt } from "@/lib/FUNC-auth";
import { exchangeCode, frontendUrl, getProvider, verifyState } from "@/lib/FUNC-oauth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/auth/oauth/{provider}/callback
 * Provider redirects here with ?code&state. We exchange the code, upsert the
 * user + linked OAuth identity, mint our JWT, and bounce back to the frontend
 * with the token in the URL fragment.
 */
export async function GET(req: Request, { params }: { params: Promise<{ provider: string }> }) {
  const { provider } = await params;
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  const cfg = getProvider(provider);
  if (!cfg) return NextResponse.json({ error: `oauth provider '${provider}' not configured` }, { status: 404 });
  if (!code || !state || !verifyState(state, provider)) {
    return NextResponse.json({ error: "invalid oauth state or code" }, { status: 400 });
  }

  try {
    const accessToken = await exchangeCode(cfg, code);
    const profile = await cfg.fetchProfile(accessToken);

    // Find by linked identity, else by email (link), else create.
    const linked = await prisma.oAuthAccount.findUnique({
      where: { provider_providerUserId: { provider, providerUserId: profile.providerUserId } },
      include: { user: true },
    });

    let user = linked?.user ?? null;
    if (!user) {
      user = await prisma.user.findUnique({ where: { email: profile.email } });
      if (!user) {
        user = await prisma.user.create({
          data: { email: profile.email, name: profile.name },
        });
      }
      await prisma.oAuthAccount.create({
        data: { userId: user.id, provider, providerUserId: profile.providerUserId },
      });
    }

    const token = signJwt({ sub: user.id, email: user.email, role: user.role });
    return NextResponse.redirect(`${frontendUrl()}/auth/callback#token=${encodeURIComponent(token)}`);
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.redirect(`${frontendUrl()}/auth/callback#error=${encodeURIComponent(msg)}`);
  }
}
