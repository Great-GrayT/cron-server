# Adding a New Project (for Sina & Reza)

## What this file is for

The main **Server Setup Runbook** is a one-time job — it built the shared server
(Docker, the Caddy reverse proxy, the shared Postgres 18, the `deploy` user, and
the GHCR bot). You do **not** repeat any of that.

**This file is the repeatable checklist for everything _after_ that:** whenever
either of you starts a new dockerized project and wants it live on the server at
`142.4.38.81` with push-to-deploy CI/CD, you follow the steps here. It assumes the
shared infrastructure already exists and is healthy.

It's **one shared guide on purpose.** The process is identical for both of you —
only your username changes — so keeping a single file avoids two copies drifting
apart. Wherever you see a `<placeholder>`, substitute your own value from the
table below. In examples, `<user>` is `sina` or `reza`.

---

## Fill these in first

Pick your values once and use them consistently everywhere below.

| Placeholder   | Example            | What it is                                                              |
| ------------- | ------------------ | ----------------------------------------------------------------------- |
| `<user>`      | `sina`             | Your GitHub username = your `/srv/apps/<user>` subdir = image namespace |
| `<project>`   | `project-x`        | Lowercase project slug — used in the repo, image, paths, DB             |
| `<subdomain>` | `app3.example.com` | Public URL                                                              |
| `<container>` | `sina-project-x`   | Container name — **must match** the Caddyfile target                    |
| `<port>`      | `3000`             | Port the app listens on **inside** the container                        |
| `<db>`        | `sina_project_x`   | Postgres database name and role                                         |

> Lowercase everything in image names — GHCR rejects capitals.

---

## Prerequisites (have these ready)

- You can SSH in as yourself: `ssh <user>@142.4.38.81`.
- You have the **deploy private key** (the `deploy_key` created during server
  setup) — you'll paste it into your repo secrets. Ask whoever set up the server
  if you don't have it. (It's shared between both of you by design.)
- The **bot account** (`team-deploy-bot`) exists. You'll grant it read on your new
  package in Step 8.

---

## The checklist

### 1. DNS

Add an A record `<subdomain> → 142.4.38.81`. (Skip if a wildcard `*.example.com`
record already covers it.)

### 2. Create the database + role (on the server)

```bash
ssh <user>@142.4.38.81
docker exec -it postgres psql -U postgres
```

```sql
CREATE ROLE <db> WITH LOGIN PASSWORD 'strong_app_password';
CREATE DATABASE <db> OWNER <db>;
\q
```

### 3. Create the project folder + config (on the server)

```bash
mkdir -p /srv/apps/<user>/<project>
nano /srv/apps/<user>/<project>/.env
```

```
DATABASE_URL=postgresql://<db>:strong_app_password@postgres:5432/<db>
NODE_ENV=production
CRON_SECRET=some_long_random_string        # only if you use cron (Step 9)
# ...other secrets...
```

```bash
chmod 600 /srv/apps/<user>/<project>/.env
nano /srv/apps/<user>/<project>/docker-compose.yml
```

```yaml
services:
  app:
    image: ghcr.io/<user>/<project>:latest
    container_name: <container>
    restart: unless-stopped
    env_file: .env
    networks:
      - web
    mem_limit: 512m
    expose:
      - "<port>"
    pull_policy: always
networks:
  web:
    external: true
```

### 4. Route the subdomain through Caddy (on the server)

```bash
nano /srv/infra/proxy/Caddyfile
```

Add:

```
<subdomain> {
    reverse_proxy <container>:<port>
}
```

Reload:

```bash
docker compose -f /srv/infra/proxy/docker-compose.yml up -d
```

### 5. Add a Dockerfile (in the repo)

**Next.js** — set `output: 'standalone'` in `next.config.js` first:

```dockerfile
FROM node:22-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
```

**NestJS / Express** — runtime stage copies the build + prod deps:

```dockerfile
FROM node:22-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["node", "dist/main.js"]
```

### 6. Add the deploy workflow (in the repo)

Create `.github/workflows/deploy.yml`. The **only** thing to change per project is
`<project>` in the two image tags:

```yaml
name: Build and Deploy
on:
  push:
    branches: [main]
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    steps:
      - uses: actions/checkout@v4

      - name: Log in to GHCR
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Set up Buildx
        uses: docker/setup-buildx-action@v3

      - name: Build and push
        uses: docker/build-push-action@v6
        with:
          context: .
          push: true
          tags: |
            ghcr.io/${{ github.repository_owner }}/<project>:latest
            ghcr.io/${{ github.repository_owner }}/<project>:${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

      - name: Deploy over SSH
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.SSH_HOST }}
          username: ${{ secrets.SSH_USER }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd ${{ secrets.APP_DIR }}
            docker compose pull
            docker compose up -d
            docker image prune -f
```

### 7. Add repo secrets (in the repo)

**Settings → Secrets and variables → Actions → New repository secret:**

- `SSH_HOST` → `142.4.38.81`
- `SSH_USER` → `deploy`
- `SSH_KEY` → the **deploy private key** (full contents)
- `APP_DIR` → `/srv/apps/<user>/<project>`

### 8. First push + grant the bot (one-time per project)

This is the one ordering gotcha. The GHCR package doesn't exist until your first
push, and the server's bot can't be granted read on a package that isn't there yet.

1. **Push to `main`.** The workflow builds and pushes the image — this **creates**
   the `ghcr.io/<user>/<project>` package. The deploy step at the end will **fail
   to pull** this first time. That's expected.
2. On GitHub, open your new package → **Package settings → Manage access → Invite
   teams or people** → add **`team-deploy-bot`** with role **Read**.
3. Log in as the bot once and **accept** the invitation.
4. **Re-run the failed deploy** (Actions → the run → _Re-run jobs_), or just push
   again. This time the server pulls and starts the container.

From here on, every push to `main` auto-deploys — no further manual steps.

### 9. (Optional) Scheduled jobs

If the project needs cron, don't put cron in the web container. Either:

- **Light job:** add a protected route (`app/api/cron/...` checking `CRON_SECRET`)
  and trigger it from host cron via a wrapper script in `/srv/scripts/`.
- **Heavier/queued:** add a second `worker` service to your compose (same image,
  `command: ["node", "worker.js"]`, its own `mem_limit`).

See **Phase 10** of the main runbook for the exact templates.

### 10. (Optional) Database migrations

Run them as a one-off process, not inside the web container:

```bash
docker compose -f /srv/apps/<user>/<project>/docker-compose.yml run --rm app npm run migrate
```

---

## Verify it's live

```bash
# on the server
docker ps                          # <container> should be "Up"
docker compose -f /srv/apps/<user>/<project>/docker-compose.yml logs -f
```

Then open `https://<subdomain>` — Caddy issues the HTTPS certificate automatically
on first request.

---

## Quick reference: what lives where

- **In your repo (git):** source, `Dockerfile`, `.github/workflows/deploy.yml`.
- **On the server (never in git):** `/srv/apps/<user>/<project>/.env` and
  `docker-compose.yml`, the `data/` dir, the Caddyfile block, the database.
- **Secrets:** app secrets go in the server `.env` (chmod 600) and in repo Actions
  secrets — **never** committed and **never** baked into the image.

## Keep it 12-factor (the short version)

- Config comes from the environment (`.env` / Actions secrets), never hardcoded.
- The web process is **stateless** — persistent data goes to Postgres or a mounted
  `data/` volume, not local container files.
- Logs go to **stdout/stderr** only; Docker captures them.
- Migrations and cron run as **separate processes**, not wired into the web app.
- Ship a new image to change things — don't edit running containers.

---

## Troubleshooting

| Symptom                                      | Likely cause                                                                                            |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Deploy step: `denied`/`unauthorized` on pull | Bot not yet granted Read on this package (Step 8), or it didn't accept the invite.                      |
| `502` from the browser                       | Container name in the Caddyfile doesn't match `container_name`, or the app isn't listening on `<port>`. |
| Cert won't issue                             | DNS A record missing/not propagated, or port 80/443 blocked.                                            |
| Container restart-loops                      | Check `logs`; usually a bad `DATABASE_URL` or a missing env var.                                        |
| App can't reach Postgres                     | Use host `postgres` (the container name), not `localhost`, in `DATABASE_URL`.                           |
