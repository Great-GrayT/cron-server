# cron-server — Infrastructure & Deployment

Project-specific checklist for deploying **cron-server** (Jobs Cron Server) to the
shared VPS at `142.4.38.81` with push-to-deploy CI/CD via GHCR + Docker.

Assumes the shared server setup is already done (Docker, Caddy, Postgres 18,
`deploy` user, GHCR bot). See the main **Server Setup Runbook** for that one-time
work — do not repeat it here.

---

## Project values

Use these consistently everywhere (server paths, Caddy, GHCR, database).

| Placeholder   | Value for this project        | Notes                                              |
| ------------- | ----------------------------- | -------------------------------------------------- |
| `<user>`      | `reza`                        | Server subdir under `/srv/apps/reza`               |
| `<project>`   | `cron-server`                 | Repo name, image name, server folder               |
| `<subdomain>` | `cron.<your-domain>`          | Public URL — set your real domain                  |
| `<container>` | `reza-cron-server`            | Must match Caddyfile `reverse_proxy` target       |
| `<port>`      | `3000`                        | Next.js listens here inside the container          |
| `<db>`        | `reza_cron_server`            | Postgres database + role name                      |
| GHCR image    | `ghcr.io/great-grayt/cron-server` | Lowercase owner; created on first push         |

GitHub repo: [Great-GrayT/cron-server](https://github.com/Great-GrayT/cron-server)

---

## What lives where

| Location | Contents |
| -------- | -------- |
| **Git repo** | Source, `Dockerfile`, `.github/workflows/deploy.yml`, `prisma/migrations/` |
| **Server** `/srv/apps/reza/cron-server/` | `.env`, `docker-compose.yml` (never commit) |
| **Server** `/srv/infra/proxy/Caddyfile` | HTTPS reverse proxy block for `<subdomain>` |
| **Server** Postgres (`postgres` container) | Database `reza_cron_server` |
| **GitHub Actions secrets** | SSH + `APP_DIR` only — app secrets stay on the server |

---

## Prerequisites

- SSH access: `ssh reza@142.4.38.81`
- **Deploy private key** (`deploy_key` from server setup) for GitHub Actions
- **siza-deploy-bot** granted Read on the GHCR package (after first push — Step 8)

---

## 1. DNS

Add an A record:

```
cron.<your-domain>  →  142.4.38.81
```

Skip if a wildcard `*.<your-domain>` already covers it.

---

## 2. Create database + role (on the server)

```bash
ssh reza@142.4.38.81
docker exec -it postgres psql -U postgres
```

```sql
CREATE ROLE reza_cron_server WITH LOGIN PASSWORD 'strong_app_password';
CREATE DATABASE reza_cron_server OWNER reza_cron_server;
\q
```

> Migrations enable `pg_trgm` automatically (`prisma migrate deploy`).

---

## 3. Create project folder + config (on the server)

```bash
mkdir -p /srv/apps/reza/cron-server
nano /srv/apps/reza/cron-server/.env
```

Minimal production `.env` (copy from `.env.example` in the repo and fill all values):

```env
DATABASE_URL=postgresql://reza_cron_server:strong_app_password@postgres:5432/reza_cron_server
NODE_ENV=production

# Required — external cron + admin routes use Bearer auth
CRON_SECRET=some_long_random_string

# Auth / multi-tenant
JWT_SECRET=some_long_random_string
ENCRYPTION_KEY=64_hex_chars_from_openssl_rand_hex_32
FRONTEND_URL=https://your-frontend.example.com
OAUTH_REDIRECT_BASE=https://cron.<your-domain>
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

# CORS — comma-separated frontend origins
CORS_ALLOW_ORIGINS=https://your-frontend.example.com

# Apply-tracking links in Telegram messages
APP_BASE_URL=https://your-frontend.example.com
TRACKING_SECRET=some_long_random_string

# Optional legacy single-tenant pipelines (multi-tenant uses DB + /api/cron/tick)
RSS_FEED_URLS=
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
RSS_STATS_FEED_URLS=

# Rate limiting / logging
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=60
LOG_LEVEL=info

# Optional one-time R2 backfill (POST /api/admin/backfill-r2)
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
```

```bash
chmod 600 /srv/apps/reza/cron-server/.env
nano /srv/apps/reza/cron-server/docker-compose.yml
```

```yaml
services:
  app:
    image: ghcr.io/great-grayt/cron-server:latest
    container_name: reza-cron-server
    restart: unless-stopped
    env_file: .env
    networks:
      - web
    mem_limit: 512m
    expose:
      - "3000"
    pull_policy: always

networks:
  web:
    external: true
```

---

## 4. Route subdomain through Caddy (on the server)

```bash
nano /srv/infra/proxy/Caddyfile
```

Add:

```
cron.<your-domain> {
    reverse_proxy reza-cron-server:3000
}
```

Reload:

```bash
docker compose -f /srv/infra/proxy/docker-compose.yml up -d
```

---

## 5. Dockerfile (in the repo — already added)

The repo includes a multi-stage **Next.js 15 + pnpm + Prisma** Dockerfile:

- Builder runs `pnpm build` with `DOCKER_BUILD=1` (enables `output: "standalone"`)
- Runner copies standalone output, static assets, and Prisma client/CLI for migrations
- Listens on `0.0.0.0:3000` inside the container

Local dev on Windows is unchanged — standalone is only enabled during Docker builds.

---

## 6. Deploy workflow (in the repo — already added)

`.github/workflows/deploy.yml` on push to `main`:

1. Builds and pushes `ghcr.io/great-grayt/cron-server:latest` (+ SHA tag)
2. SSHes to the server, pulls the image, runs migrations, restarts the container

---

## 7. GitHub repository secrets

**Settings → Secrets and variables → Actions → New repository secret:**

| Secret     | Value                          |
| ---------- | ------------------------------ |
| `SSH_HOST` | `142.4.38.81`                  |
| `SSH_USER` | `deploy`                       |
| `SSH_KEY`  | deploy private key (full PEM)  |
| `APP_DIR`  | `/srv/apps/reza/cron-server`   |

> Remove old PM2-era secrets (`DEPLOY_PATH`, `SSH_PORT`) if they exist — they are
> no longer used.

---

## 8. First push + grant the bot (one-time)

1. **Push to `main`.** The workflow builds and pushes the GHCR image. The deploy
   step may **fail to pull** on the first run — expected.
2. GitHub → the **Great-GrayT** account → **Packages** → `cron-server` →
   **Package settings → Manage access** → invite **`siza-deploy-bot`** with role **Read**.
3. Log in as the bot and **accept** the invitation.
4. **Re-run** the failed workflow (or push again). The server pulls and starts the container.

Every subsequent push to `main` auto-deploys.

---

## 9. Scheduled cron (required for this project)

This app does **not** run its own scheduler. An external caller must hit the
multi-tenant tick endpoint on a schedule (e.g. every minute):

```
GET https://cron.<your-domain>/api/cron/tick
Authorization: Bearer <CRON_SECRET>
```

On the server, add a host cron entry (via `/srv/scripts/` wrapper — see main
runbook Phase 10):

```bash
# Example: every minute
* * * * * /srv/scripts/curl-cron.sh https://cron.<your-domain>/api/cron/tick
```

The wrapper should send `Authorization: Bearer $CRON_SECRET` (read from a root-only
file or the same secret you put in `.env`).

Legacy per-pipeline endpoints still exist but multi-tenant schedules use `/api/cron/tick`:

| Endpoint | Purpose |
| -------- | ------- |
| `GET /api/cron/tick` | **Primary** — runs all due user schedules |
| `GET /api/cron/check-jobs` | Legacy main RSS → Telegram pipeline |
| `GET /api/cron/check-jobs-aryan` | Legacy Aryan pipeline |
| `GET /api/stats/get` | Stats RSS ingestion |

---

## 10. Database migrations

Migrations run automatically on every deploy (in the GitHub Actions SSH step).
To run manually:

```bash
docker compose -f /srv/apps/reza/cron-server/docker-compose.yml run --rm \
  --entrypoint "" app node node_modules/prisma/build/index.js migrate deploy
```

Never run migrations inside a long-lived web container process — always as a
one-off `docker compose run`.

---

## Verify it's live

```bash
# on the server
docker ps                                    # reza-cron-server should be "Up"
docker compose -f /srv/apps/reza/cron-server/docker-compose.yml logs -f

# smoke test (from anywhere)
curl -s -o /dev/null -w "%{http_code}" \
  -H "Authorization: Bearer YOUR_CRON_SECRET" \
  https://cron.<your-domain>/api/cron/tick
```

Open `https://cron.<your-domain>` — Caddy issues HTTPS on first request.

---

## Troubleshooting

| Symptom | Likely cause |
| ------- | ------------ |
| Deploy: `denied` / `unauthorized` on pull | Bot not granted Read on GHCR package (Step 8) |
| `502` in browser | Caddy `container_name` mismatch, or app not on port 3000 |
| Container restart-loops | Bad `DATABASE_URL`, missing `CRON_SECRET`/`JWT_SECRET`, or Prisma connect failure |
| App can't reach Postgres | Use host `postgres` in `DATABASE_URL`, not `localhost` |
| Cron never runs | Host cron / wrapper not configured (Step 9) |
| Migrations fail | DB role missing, or `pg_trgm` extension blocked (unlikely on Postgres 18) |

---

## 12-factor notes for this app

- **Stateless web process** — job data and user config live in Postgres.
- **Config via environment** — `.env` on server; never baked into the image.
- **Logs to stdout** — `docker compose logs`; structured JSON via `lib/logger.ts`.
- **Migrations as one-off** — separate from the web `CMD`.
- **Cron as external trigger** — HTTP to `/api/cron/tick`, not in-container cron.
