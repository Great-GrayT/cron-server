import { NextResponse } from "next/server";
import { buildAuthRedirect, getProvider, signState } from "@/lib/FUNC-oauth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/auth/oauth/{provider}
 * Starts the OAuth flow — redirects the browser to Google/GitHub consent.
 */
export async function GET(_req: Request, { params }: { params: Promise<{ provider: string }> }) {
  const { provider } = await params;
  const cfg = getProvider(provider);
  if (!cfg) {
    return NextResponse.json({ error: `oauth provider '${provider}' not configured` }, { status: 404 });
  }
  return NextResponse.redirect(buildAuthRedirect(cfg, signState(provider)));
}
