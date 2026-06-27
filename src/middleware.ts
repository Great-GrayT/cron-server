import { NextResponse, type NextRequest } from "next/server";

/**
 * Global edge security middleware — per-IP rate limiting + baseline headers.
 *
 * First line of defense against abuse of the public API. Uses a lightweight
 * in-memory fixed-window counter per instance (KISS); for multi-instance scale,
 * back it with the ILock/Redis layer. Applies to API routes only.
 */

export const config = {
  matcher: ["/api/:path*"],
};

const WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS ?? 60_000);
const MAX_REQUESTS = Number(process.env.RATE_LIMIT_MAX_REQUESTS ?? 60);

interface Bucket {
  count: number;
  resetAt: number;
}

// Per-instance store. Survives between requests on the same worker.
const buckets = new Map<string, Bucket>();

function clientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

function rateLimited(ip: string, now: number): { limited: boolean; remaining: number; resetAt: number } {
  const existing = buckets.get(ip);
  if (!existing || existing.resetAt <= now) {
    const resetAt = now + WINDOW_MS;
    buckets.set(ip, { count: 1, resetAt });
    return { limited: false, remaining: MAX_REQUESTS - 1, resetAt };
  }
  existing.count += 1;
  const remaining = Math.max(0, MAX_REQUESTS - existing.count);
  return { limited: existing.count > MAX_REQUESTS, remaining, resetAt: existing.resetAt };
}

// Cross-origin: the frontend lives on a different origin and calls this server.
// Allow a comma-separated list from CORS_ALLOW_ORIGINS, else reflect any origin.
const ALLOWED_ORIGINS = (process.env.CORS_ALLOW_ORIGINS ?? "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

function corsHeaders(req: NextRequest): Record<string, string> {
  const origin = req.headers.get("origin") ?? "";
  const allow = ALLOWED_ORIGINS.length === 0 ? origin || "*" : ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0]!;
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "GET,POST,PATCH,PUT,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

export function middleware(req: NextRequest): NextResponse {
  const cors = corsHeaders(req);

  // Preflight — answer immediately, no rate-limit charge.
  if (req.method === "OPTIONS") {
    return new NextResponse(null, { status: 204, headers: cors });
  }

  const now = Date.now();
  const ip = clientIp(req);
  const { limited, remaining, resetAt } = rateLimited(ip, now);

  const headers = new Headers({
    ...cors,
    "X-RateLimit-Limit": String(MAX_REQUESTS),
    "X-RateLimit-Remaining": String(remaining),
    "X-RateLimit-Reset": String(Math.ceil(resetAt / 1000)),
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "no-referrer",
  });

  if (limited) {
    headers.set("Retry-After", String(Math.ceil((resetAt - now) / 1000)));
    return NextResponse.json({ error: "rate limit exceeded" }, { status: 429, headers });
  }

  const res = NextResponse.next();
  headers.forEach((value, key) => res.headers.set(key, value));
  return res;
}
