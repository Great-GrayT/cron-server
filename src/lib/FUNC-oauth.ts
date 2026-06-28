import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

/**
 * OAuth provider configs + helpers (Google, GitHub).
 *
 * Server-side code flow: the frontend hits /api/auth/oauth/{provider}, we
 * redirect to the provider, the provider calls our /callback, we exchange the
 * code for a profile and issue our own JWT. Only active when the provider's
 * client id/secret env vars are set.
 */

export interface OAuthProfile {
  providerUserId: string;
  email: string;
  name: string | null;
  avatarUrl?: string | null;
}

export interface ProviderConfig {
  id: "google" | "github";
  authUrl: string;
  tokenUrl: string;
  scope: string;
  clientId: string;
  clientSecret: string;
  fetchProfile(accessToken: string): Promise<OAuthProfile>;
}

function redirectBase(): string {
  // The provider redirects back to THIS server, so the base must be the server's
  // public origin. Falls back to APP_BASE_URL so one env covers tracking + OAuth.
  return process.env.OAUTH_REDIRECT_BASE ?? process.env.APP_BASE_URL ?? "http://localhost:3000";
}

export function callbackUrl(provider: string): string {
  return `${redirectBase()}/api/auth/oauth/${provider}/callback`;
}

export function frontendUrl(): string {
  return process.env.FRONTEND_URL ?? "http://localhost:3000";
}

export function getProvider(id: string): ProviderConfig | null {
  if (id === "google") {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    if (!clientId || !clientSecret) return null;
    return {
      id: "google",
      authUrl: "https://accounts.google.com/o/oauth2/v2/auth",
      tokenUrl: "https://oauth2.googleapis.com/token",
      scope: "openid email profile",
      clientId,
      clientSecret,
      async fetchProfile(accessToken) {
        const res = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const j = (await res.json()) as { id: string; email: string; name?: string; picture?: string };
        return { providerUserId: String(j.id), email: j.email.toLowerCase(), name: j.name ?? null, avatarUrl: j.picture ?? null };
      },
    };
  }
  if (id === "github") {
    const clientId = process.env.GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;
    if (!clientId || !clientSecret) return null;
    return {
      id: "github",
      authUrl: "https://github.com/login/oauth/authorize",
      tokenUrl: "https://github.com/login/oauth/access_token",
      scope: "read:user user:email",
      clientId,
      clientSecret,
      async fetchProfile(accessToken) {
        const headers = { Authorization: `Bearer ${accessToken}`, Accept: "application/vnd.github+json" };
        const u = (await (await fetch("https://api.github.com/user", { headers })).json()) as {
          id: number;
          login: string;
          name?: string;
          email?: string | null;
          avatar_url?: string;
        };
        let email = u.email ?? null;
        if (!email) {
          const emails = (await (await fetch("https://api.github.com/user/emails", { headers })).json()) as {
            email: string;
            primary: boolean;
            verified: boolean;
          }[];
          email = emails.find((e) => e.primary && e.verified)?.email ?? emails[0]?.email ?? null;
        }
        if (!email) throw new Error("GitHub account has no usable email");
        return { providerUserId: String(u.id), email: email.toLowerCase(), name: u.name ?? u.login, avatarUrl: u.avatar_url ?? null };
      },
    };
  }
  return null;
}

export function buildAuthRedirect(p: ProviderConfig, state: string): string {
  const params = new URLSearchParams({
    client_id: p.clientId,
    redirect_uri: callbackUrl(p.id),
    response_type: "code",
    scope: p.scope,
    state,
  });
  return `${p.authUrl}?${params.toString()}`;
}

export async function exchangeCode(p: ProviderConfig, code: string): Promise<string> {
  const res = await fetch(p.tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" },
    body: new URLSearchParams({
      client_id: p.clientId,
      client_secret: p.clientSecret,
      code,
      redirect_uri: callbackUrl(p.id),
      grant_type: "authorization_code",
    }),
  });
  const j = (await res.json()) as { access_token?: string; error?: string };
  if (!j.access_token) throw new Error(`token exchange failed: ${j.error ?? "no access_token"}`);
  return j.access_token;
}

// ---- CSRF state (signed, short-lived) ----

function stateSecret(): string {
  const s = process.env.JWT_SECRET;
  if (!s) throw new Error("JWT_SECRET is not set.");
  return s;
}

export function signState(provider: string): string {
  const exp = Date.now() + 10 * 60 * 1000;
  const nonce = randomBytes(8).toString("hex");
  const body = `${provider}.${nonce}.${exp}`;
  const sig = createHmac("sha256", stateSecret()).update(body).digest("base64url");
  return `${body}.${sig}`;
}

export function verifyState(state: string, provider: string): boolean {
  const parts = state.split(".");
  if (parts.length !== 4) return false;
  const [prov, nonce, exp, sig] = parts;
  if (prov !== provider || Number(exp) < Date.now()) return false;
  const expected = createHmac("sha256", stateSecret()).update(`${prov}.${nonce}.${exp}`).digest("base64url");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}
