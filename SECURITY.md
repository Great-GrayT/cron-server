# Security hardening

Layered defense for the API. Each layer is independent — an attacker must beat
all of them. App-layer code lives in this repo; the edge/proxy/OS layers are
applied **on the server** (they are not in git) and are documented here.

```
Internet
  │
  ▼  ── Layer 1: Cloudflare (edge) ── DDoS L3-7, WAF, bot/Turnstile, rate rules, cache, hides origin IP
  ▼  ── Layer 2: ufw ── origin only accepts 443 from Cloudflare ranges
  ▼  ── Layer 3: Caddy ── TLS, security headers, timeouts, max body, rate_limit, real client IP
  ▼  ── Layer 4: Next.js middleware ── tiered per-IP rate limits, CORS fail-closed, headers
  ▼  ── Layer 5: route handlers ── JWT (+ revocation), admin role recheck, password re-auth, zod
  ▼  Postgres (parameterised via Prisma)
```

---

## Layer 5 — application (in this repo, already shipped)

- **AuthN**: JWT HS256 (`FUNC-auth.ts`), scrypt passwords (`timingSafeEqual`).
  `verifyJwt` ignores the header `alg` and always recomputes HS256 → immune to
  `alg:none` / RS↔HS confusion.
- **Token revocation**: every JWT embeds `ver` = the user's `token_version`.
  `requireAdmin` / `requireFreshUser` reject a token whose `ver` no longer
  matches. Password change/reset bumps `token_version`, killing all old tokens.
  TTL is short + env-tunable (`JWT_TTL_HOURS`, default 72).
- **AuthZ**: `requireAdmin` re-checks the DB role; `clean-db` also re-verifies
  the admin's own password; destructive datasets are a code allowlist.
- **Input**: zod on every route; Prisma parameterises all SQL.
- **Rate limits**: tiered sliding-window in `middleware.ts` (see below).
- **CORS**: fail-closed in production (`middleware.ts`).

### Env vars to set on the server (`.env`, chmod 600)

```dotenv
# Comma-separated exact origins allowed to call the API (REQUIRED in prod —
# without it, cross-origin requests are denied).
CORS_ALLOW_ORIGINS=https://jobcron.<your-domain>

# JWT lifetime in hours (shorter = smaller stolen-token window). Default 72.
JWT_TTL_HOURS=72

# General rate-limit tier (auth/admin tiers are stricter, hard-coded).
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=240

# Strong random secret (rotate on suspected compromise — rotating it logs
# everyone out, which is the desired effect).
JWT_SECRET=<64+ random chars>
```

Rate-limit tiers (per client IP, sliding window):

| Endpoints | Budget |
|---|---|
| `/api/auth/login`, reset, verify, oauth | 10 / min |
| `/api/auth/{register,forgot-password,resend-verification}` (send email) | 5 / 15 min |
| `/api/admin/{clean-db,backfill-r2,stats/rebuild}` | 10 / min |
| everything else | 240 / min |

---

## Layer 1 — Cloudflare (free plan is enough)

Put the domain behind Cloudflare (orange-cloud the `cron` + frontend records).

1. **SSL/TLS** → mode **Full (strict)**. Keep Caddy's real cert on the origin.
2. **DDoS**: on by default (L3/L4/L7). Turn on **Bot Fight Mode**
   (Security → Bots).
3. **WAF** → enable **Cloudflare Managed Ruleset** + **OWASP Core Ruleset**
   (Security → WAF → Managed rules).
4. **Rate limiting rules** (Security → WAF → Rate limiting rules) — a cheap
   extra tier *before* traffic reaches the origin:
   - `(http.request.uri.path contains "/api/auth/")` → 20 req / 1 min per IP → *Block* 1 min.
   - `(http.request.uri.path contains "/api/admin/")` → 30 req / 1 min per IP → *Managed Challenge*.
   - catch-all `(http.request.uri.path contains "/api/")` → 600 req / 1 min per IP → *Block*.
5. **Turnstile** on login/register/forgot-password (issue a token in the form,
   verify server-side) once Bot Fight Mode isn't enough. Follow-up, not required.
6. **Cache** the public read API (stats) if it's hot: a Cache Rule on
   `/api/stats/*` / `/api/v1/stats/*` with a short edge TTL (e.g. 60s) absorbs
   read floods. Only for endpoints with no per-user data.

### Lock the origin to Cloudflare (Layer 2 — ufw)

So nobody can bypass Cloudflare and hit the origin IP directly (which would
defeat the edge WAF/rate-limit and let `X-Forwarded-For` be spoofed):

```bash
# Remove the blanket 443 rule, allow 443 only from Cloudflare's ranges.
sudo ufw delete allow 443/tcp
for ip in $(curl -s https://www.cloudflare.com/ips-v4); do sudo ufw allow from $ip to any port 443 proto tcp; done
for ip in $(curl -s https://www.cloudflare.com/ips-v6); do sudo ufw allow from $ip to any port 443 proto tcp; done
sudo ufw reload
```

The app already prefers `CF-Connecting-IP` for the real client IP, which is only
trustworthy once the origin exclusively accepts Cloudflare traffic (above).

---

## Layer 3 — Caddy hardening

In `/srv/infra/proxy/Caddyfile`, the `cron.<domain>` block:

```caddyfile
cron.<your-domain> {
	# Real client IP from Cloudflare (needed for correct rate-limit keying/logs).
	# Requires: xcaddy build with github.com/WeidiDeng/caddy-cloudflare-ip (or set
	# trusted_proxies to Cloudflare ranges).
	trusted_proxies cloudflare

	# Cap request bodies (backfill/clean send tiny JSON; nothing needs megabytes).
	request_body {
		max_size 1MB
	}

	# Timeouts so slow-loris / hung clients can't tie up connections.
	timeouts {
		read_body   10s
		read_header 5s
		idle        2m
	}

	# Baseline security headers at the edge (belt-and-suspenders with the app).
	header {
		Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
		X-Content-Type-Options    "nosniff"
		X-Frame-Options           "DENY"
		Referrer-Policy           "no-referrer"
		-Server
	}

	# Optional: origin-side rate limit (xcaddy build with mholt/caddy-ratelimit).
	# rate_limit {
	#   zone api { key {http.request.remote.host}; events 600; window 1m }
	# }

	reverse_proxy reza-cron-server:3000
}
```

> `trusted_proxies` / `rate_limit` need a Caddy built with those plugins
> (`xcaddy build --with ...`). If you can't rebuild Caddy now, the Cloudflare
> rate-limit rules + ufw origin lock already cover the gap.

---

## Follow-ups (not yet done — ranked)

1. **Redis-backed rate limiter** — the in-memory store is per-instance and
   resets on redeploy. Move the sliding-window to Redis for durability +
   multi-instance. (Hook: swap the `Map` in `middleware.ts`.)
2. **httpOnly cookie for the token** — the frontend keeps the JWT in
   `localStorage` (XSS-exfiltratable). Move to a `httpOnly; Secure; SameSite`
   cookie (needs same-origin proxy or `SameSite=None` + credentialed CORS).
3. **Refresh tokens** — replace the single 72h access token with a short access
   token + rotating, revocable refresh token, so read routes get real
   per-request revocation without a DB hit.
4. **`pnpm audit` + Dependabot** in CI (supply-chain).
5. **`/.well-known/security.txt`** + abuse-spike alerting on 401/429 rates.

## References

OWASP API Security Top 10 (2023), OWASP ASVS 5.0 (2025), OWASP Secure Headers
Project, Cloudflare DDoS/WAF/Turnstile docs.
