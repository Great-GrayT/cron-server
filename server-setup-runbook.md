# Server Setup Runbook — Ubuntu 26.04 / Docker / GHCR CI/CD

A follow-along guide for an 8GB / 4-core server (`142.4.38.81`) shared by two
trusting users (`sina`, `reza`), running dockerized Next.js / React / Node /
Express / NestJS apps with SQLite + Postgres 18, deployed via GitHub Actions →
GHCR → server.

**Architecture decisions baked in:**

- OS: **Ubuntu 26.04 LTS** (codename `resolute`).
- Images are **built in GitHub Actions**, pushed to **GHCR**, and the server only **pulls and runs**.
- **One shared Docker daemon**; both users are in the `docker` group (fine because they trust each other).
- **One shared Caddy reverse proxy** (in Docker) holds 80/443 and routes by subdomain.
- **One shared Postgres 18** instance with a separate DB + role per project.
- A dedicated, non-sudo **`deploy`** user runs CI deploys.
- Repos stay under **personal accounts**; a dedicated **bot account** is a read collaborator on each GHCR package so the server can pull both (**Option 2**).

> Conventions: `$` = run as your normal sudo user. Replace `example.com` with your
> real domain. The repo owners below are `sina` and `reza` (lowercase — GHCR
> requires lowercase namespaces).

---

## Phase 0 — Before you start

You need:

1. The server at **142.4.38.81**, Ubuntu 26.04, SSH access.
2. A **domain name**. Create these DNS **A records**, all pointing to **142.4.38.81**:
   - `app1.example.com`, `app2.example.com`, … (one per project), **or** a wildcard `*.example.com`.
3. Your **SSH public key** on your laptop (`cat ~/.ssh/id_ed25519.pub`). If missing:
   ```bash
   ssh-keygen -t ed25519 -C "you@laptop"
   ```
4. GitHub accounts for `sina` and `reza`, plus one **bot account** (Phase 6).

---

## Phase 1 — OS hardening

Do this first, before anything is exposed.

### 1.1 Update the system

```bash
sudo apt update && sudo apt upgrade -y
sudo timedatectl set-timezone UTC          # optional; pick your tz
```

### 1.2 Create the two human users

```bash
sudo adduser sina
sudo adduser reza
sudo usermod -aG sudo sina
sudo usermod -aG sudo reza
```

### 1.3 Install each user's SSH key

Paste **their** public key. Example for `sina`:

```bash
sudo mkdir -p /home/sina/.ssh
sudo nano /home/sina/.ssh/authorized_keys     # paste sina's public key, save
sudo chmod 700 /home/sina/.ssh
sudo chmod 600 /home/sina/.ssh/authorized_keys
sudo chown -R sina:sina /home/sina/.ssh
```

Repeat for `reza`. **Open a new terminal and confirm `ssh sina@142.4.38.81` and
`ssh reza@142.4.38.81` both work before continuing** — the next step disables
password login.

### 1.4 Harden SSH

```bash
sudo nano /etc/ssh/sshd_config
```

Set:

```
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
```

Then:

```bash
sudo systemctl restart ssh
```

### 1.5 Firewall (ufw)

```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
sudo ufw status verbose
```

### 1.6 fail2ban

```bash
sudo apt install -y fail2ban
sudo systemctl enable --now fail2ban
```

### 1.7 Automatic security updates

```bash
sudo apt install -y unattended-upgrades
sudo dpkg-reconfigure --priority=low unattended-upgrades   # choose "Yes"
```

### 1.8 Swap (critical on 8GB — prevents hard OOM crashes)

```bash
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
echo 'vm.swappiness=10' | sudo tee /etc/sysctl.d/99-swappiness.conf
sudo sysctl -p /etc/sysctl.d/99-swappiness.conf
free -h
```

---

## Phase 2 — Docker

### 2.1 Install Docker Engine + Compose plugin (official repo)

```bash
for pkg in docker.io docker-doc docker-compose docker-compose-v2 podman-docker containerd runc; do
  sudo apt remove -y $pkg 2>/dev/null
done

sudo apt update
sudo apt install -y ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# The $(. /etc/os-release ...) part auto-resolves to "resolute" on Ubuntu 26.04
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

### 2.2 Let both users run Docker without sudo

```bash
sudo usermod -aG docker sina
sudo usermod -aG docker reza
# log out/in for group changes, then test:
docker run --rm hello-world
```

### 2.3 Log rotation (logs WILL fill the disk otherwise)

```bash
sudo nano /etc/docker/daemon.json
```

```json
{
  "log-driver": "json-file",
  "log-opts": { "max-size": "10m", "max-file": "3" },
  "live-restore": true
}
```

```bash
sudo systemctl restart docker
```

### 2.4 Create the shared Docker network

```bash
docker network create web
```

---

## Phase 3 — Folder structure & shared permissions

### 3.1 Create users' group + directories

```bash
sudo groupadd deploy
sudo usermod -aG deploy sina
sudo usermod -aG deploy reza

sudo mkdir -p /srv/{infra/proxy/data,infra/postgres/data,apps/sina,apps/reza,backups/postgres,scripts}

sudo chown -R root:deploy /srv
sudo chmod -R 2775 /srv        # leading 2 = setgid: new files inherit the "deploy" group
```

### 3.2 Full server folder structure

This is the complete populated tree once everything is set up. **Bold = tracked
in a git "infra" repo and cloned onto the server. Everything else (`.env` files
and all `data/` dirs) is server-only — gitignored, never baked into an image.**

```
/srv/
│
├── infra/                              # shared infrastructure (both users)
│   ├── proxy/
│   │   ├── docker-compose.yml          # ← git
│   │   ├── Caddyfile                   # ← git
│   │   └── data/                       # Let's Encrypt certs            (server-only, persistent)
│   │
│   └── postgres/
│       ├── docker-compose.yml          # ← git
│       ├── .env                        # POSTGRES_PASSWORD (chmod 600)  (server-only)
│       └── data/                       # PGDATA                         (server-only, persistent, backed up)
│
├── apps/
│   ├── sina/
│   │   └── project-a/
│   │       ├── docker-compose.yml      # ← git
│   │       ├── .env                    # app secrets (chmod 600)        (server-only)
│   │       └── data/                   # sqlite file / uploads          (server-only, persistent, backed up)
│   │
│   └── reza/
│       └── project-b/
│           ├── docker-compose.yml      # ← git
│           ├── .env                    # app secrets (chmod 600)        (server-only)
│           └── data/                                                    (server-only, persistent, backed up)
│
├── backups/
│   └── postgres/                       # pg_dumpall output, rotated, pushed off-server
│
└── scripts/
    ├── backup-postgres.sh              # ← git
    └── prune.sh                        # ← git
```

Each app reaches Postgres and Caddy **by container name** over the `web` network,
so apps publish **no host ports** — only Caddy binds 80/443. That's why `sina`
and `reza` never collide on port numbers.

---

## Phase 4 — Reverse proxy (Caddy, in Docker)

```bash
nano /srv/infra/proxy/docker-compose.yml
```

```yaml
services:
  caddy:
    image: caddy:2
    container_name: caddy
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile:ro
      - ./data:/data
    networks:
      - web
networks:
  web:
    external: true
```

```bash
nano /srv/infra/proxy/Caddyfile
```

```
app1.example.com {
    reverse_proxy sina-project-a:3000
}

app2.example.com {
    reverse_proxy reza-project-b:3000
}
```

```bash
cd /srv/infra/proxy
docker compose up -d
docker compose logs -f caddy     # watch certificates issue; Ctrl-C to exit
```

Add a project later: add a block here, then re-run `docker compose up -d` (Caddy reloads).

---

## Phase 5 — Shared Postgres 18

```bash
nano /srv/infra/postgres/.env
```

```
POSTGRES_PASSWORD=CHANGE_ME_strong_superuser_password
```

```bash
chmod 600 /srv/infra/postgres/.env
nano /srv/infra/postgres/docker-compose.yml
```

```yaml
services:
  postgres:
    image: postgres:18
    container_name: postgres
    restart: unless-stopped
    env_file: .env
    volumes:
      - ./data:/var/lib/postgresql
    networks:
      - web
    mem_limit: 1g
    shm_size: 256m
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

networks:
  web:
    external: true
```

```bash
cd /srv/infra/postgres
docker compose up -d
docker compose logs -f postgres   # wait for "database system is ready"; Ctrl-C
```

### Create a database + role per project

```bash
docker exec -it postgres psql -U postgres
```

```sql
CREATE ROLE sina_project_a WITH LOGIN PASSWORD 'strong_app_password';
CREATE DATABASE sina_project_a OWNER sina_project_a;
\q
```

Connection string for that app (apps reach Postgres by the name `postgres`):

```
postgresql://sina_project_a:strong_app_password@postgres:5432/sina_project_a
```

---

## Phase 6 — Deploy user + GHCR pull (Option 2: bot account)

### 6.1 Create the CI deploy user (no sudo; can use Docker + /srv)

```bash
sudo adduser --disabled-password --gecos "" deploy
sudo usermod -aG docker,deploy deploy
```

### 6.2 Deploy SSH key (CI logs in with this)

On your **laptop**:

```bash
ssh-keygen -t ed25519 -f ~/.ssh/deploy_key -C "github-actions-deploy" -N ""
```

Put the **public** half on the server:

```bash
sudo mkdir -p /home/deploy/.ssh
echo "PASTE_DEPLOY_PUBLIC_KEY_HERE" | sudo tee /home/deploy/.ssh/authorized_keys
sudo chmod 700 /home/deploy/.ssh
sudo chmod 600 /home/deploy/.ssh/authorized_keys
sudo chown -R deploy:deploy /home/deploy/.ssh
```

Keep the **private** half (`~/.ssh/deploy_key`) for the GitHub secret (Phase 8).

### 6.3 The pull problem and the bot solution

The repos stay under personal accounts: images live at `ghcr.io/sina/project-a`
and `ghcr.io/reza/project-b`. The server does **one** `docker login`, but a token
only pulls packages its owner can read — and neither person can read the other's
private package. A dedicated **bot account** that is a read collaborator on _both_
packages fixes this with a single credential.

> Use a **classic** PAT, not fine-grained — fine-grained tokens still fail (403)
> on GHCR docker pulls.

**One-time setup:**

1. **Create a bot GitHub account** (e.g. `team-deploy-bot`) and enable 2FA. It
   never needs access to repo _code_ — only to packages.

2. **Run each repo's workflow once** (Phase 8) so the packages actually exist.
   A package can't be shared until its first `docker push` has created it.

3. **Each owner grants the bot read on their own package:**
   - `sina` → his `project-a` package → **Package settings → Manage access →
     Invite teams or people** → add `team-deploy-bot` → role **Read**.
   - `reza` does the same on `project-b`.

4. **Log in as the bot and accept both invitations.**

5. **Bot generates a classic PAT:** github.com/settings/tokens → _Tokens (classic)_
   → scope **`read:packages` only**.

6. **Log the server in as the bot** (stored under the `deploy` user):
   ```bash
   sudo su - deploy
   echo "BOT_CLASSIC_PAT" | docker login ghcr.io -u team-deploy-bot --password-stdin
   chmod 600 ~/.docker/config.json
   exit
   ```
   That single login now pulls **both** private packages.

> The bot PAT is long-lived and stored base64 (not encrypted) in
> `/home/deploy/.docker/config.json` — keep it off any repo and set a reminder to
> rotate it. Adding a future project later means just one extra step: that owner
> grants the bot **Read** on the new package.

---

## Phase 7 — Put one project on the server

```bash
mkdir -p /srv/apps/sina/project-a
nano /srv/apps/sina/project-a/.env
```

```
DATABASE_URL=postgresql://sina_project_a:strong_app_password@postgres:5432/sina_project_a
NODE_ENV=production
CRON_SECRET=some_long_random_string        # see Phase 10
# ...other app secrets
```

```bash
chmod 600 /srv/apps/sina/project-a/.env
nano /srv/apps/sina/project-a/docker-compose.yml
```

```yaml
services:
  app:
    image: ghcr.io/sina/project-a:latest # lowercase owner namespace
    container_name: sina-project-a # the name Caddy proxies to
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

Reza's app is identical with `ghcr.io/reza/project-b`, container name
`reza-project-b`, in `/srv/apps/reza/project-b/`.

Add the matching `Caddyfile` block, then once the image exists (Phase 8):

```bash
cd /srv/apps/sina/project-a
docker compose up -d
```

---

## Phase 8 — GitHub Actions: build → push → deploy

Each repo has its **own** workflow and its **own** Actions secrets, managed by
its **own** owner. The bot is **not** involved in pushing — each repo pushes to
its own namespace via the built-in `GITHUB_TOKEN`.

### 8.1 Repo secrets (each owner sets these on their repo)

**Settings → Secrets and variables → Actions → New repository secret**:

- `SSH_HOST` — `142.4.38.81`
- `SSH_USER` — `deploy`
- `SSH_KEY` — contents of `~/.ssh/deploy_key` (the **private** key)
- `APP_DIR` — `/srv/apps/sina/project-a` (or `/srv/apps/reza/project-b`)

### 8.2 Dockerfile (multi-stage, slim — Next.js standalone example)

Set `output: 'standalone'` in `next.config.js` first.

```dockerfile
# ---- build ----
FROM node:22-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ---- runtime ----
FROM node:22-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
```

> NestJS/Express runtime stage instead copies `dist/` + prod `node_modules` and
> runs `node dist/main.js`.

### 8.3 Workflow `.github/workflows/deploy.yml`

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
            ghcr.io/${{ github.repository_owner }}/project-a:latest
            ghcr.io/${{ github.repository_owner }}/project-a:${{ github.sha }}
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

---

## Phase 9 — Backups, pruning, monitoring

### 9.1 Postgres backups

```bash
nano /srv/scripts/backup-postgres.sh
```

```bash
#!/usr/bin/env bash
set -euo pipefail
STAMP=$(date +%F_%H%M)
OUT=/srv/backups/postgres
docker exec postgres pg_dumpall -U postgres | gzip > "$OUT/all_$STAMP.sql.gz"
find "$OUT" -name '*.sql.gz' -mtime +14 -delete
```

```bash
chmod +x /srv/scripts/backup-postgres.sh
crontab -e
```

```
0 3 * * * /srv/scripts/backup-postgres.sh
```

> Push these **off-server** (rclone/rsync to object storage) and **test a restore
> once**. Also back up each app's `data/` dir.

### 9.2 Weekly image cleanup

```bash
nano /srv/scripts/prune.sh
```

```bash
#!/usr/bin/env bash
docker image prune -af --filter "until=168h"   # never blanket-prune volumes
```

```bash
chmod +x /srv/scripts/prune.sh
# crontab:  0 4 * * 0 /srv/scripts/prune.sh
```

### 9.3 Lightweight monitoring (optional)

Uptime Kuma (uptime), Dozzle (logs in browser), lazydocker/ctop (live resource
view). Skip Prometheus/Grafana at first — too heavy for 8GB.

---

## Phase 10 — Scheduled jobs (Next.js cron)

Self-hosted Next.js has no Vercel Cron, so you schedule jobs yourself. Pick by weight.

### Option A — host cron hits a protected API route (simplest; recommended for light jobs)

Add a route that checks a shared secret:

```ts
// app/api/cron/cleanup/route.ts
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic"; // never cache a cron route

export async function GET(req: Request) {
  if (
    req.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  // ...do the work (idempotently)...
  return NextResponse.json({ ok: true });
}
```

On the **server host**, a small wrapper keeps the secret out of crontab:

```bash
nano /srv/scripts/cron-cleanup.sh
```

```bash
#!/usr/bin/env bash
source /srv/apps/sina/project-a/.env          # provides CRON_SECRET
curl -fsS -H "Authorization: Bearer $CRON_SECRET" \
  https://app1.example.com/api/cron/cleanup >/dev/null
```

```bash
chmod +x /srv/scripts/cron-cleanup.sh
crontab -e
```

```
0 2 * * * /srv/scripts/cron-cleanup.sh
```

### Option B — a dedicated worker container (for heavier / queued / frequent jobs)

Same image, different command, its own process — the 12-factor "clock/worker"
process type. Add to the project's compose:

```yaml
worker:
  image: ghcr.io/sina/project-a:latest
  container_name: sina-project-a-worker
  command: ["node", "worker.js"] # uses node-cron, or BullMQ + Redis
  restart: unless-stopped
  env_file: .env
  networks: [web]
  mem_limit: 256m
```

### Rules to avoid foot-guns

- **Never run cron inside the web container.** Containers should run one process; an in-container crontab resets on restart and is invisible to your logs.
- **Make jobs idempotent** (safe to run twice).
- **Run exactly one scheduler.** If you ever scale the web service to multiple replicas, an in-process timer fires on every replica — externalize scheduling (host cron / one worker / a tool like Ofelia) so it fires once.

---

## Phase 11 — Staying 12-factor

How each factor maps to this setup, and the one action it implies:

1. **Codebase** — one repo per app, in git. ✓ already true.
2. **Dependencies** — declared in `package.json`, installed in the Docker build (`npm ci`); no host-level deps. ✓
3. **Config** — lives in the environment via `.env` files / Actions secrets, never in the image and never committed. ✓ (this is why `.env` is gitignored and `chmod 600`).
4. **Backing services** — Postgres/Redis are attached resources referenced only by URL (`DATABASE_URL`). Swappable without code changes. ✓
5. **Build, release, run** — strictly separated: CI builds the image (build), image + `.env` = release (`compose pull`), `compose up` = run. Don't mutate running containers; ship a new image.
6. **Processes** — keep the web process **stateless**. No in-memory sessions or local file writes that must survive a restart; persistent data goes to Postgres or a mounted `data/` volume.
7. **Port binding** — the app self-hosts its server (`node server.js` on 3000) and is reached over the `web` network. ✓
8. **Concurrency** — scale by adding process types/containers (web + worker, Phase 10), not threads inside one bloated process.
9. **Disposability** — fast startup, graceful shutdown: handle `SIGTERM`, finish in-flight work, exit. `restart: unless-stopped` covers crashes.
10. **Dev/prod parity** — same Docker image and same Postgres **18** in dev and prod; keep gaps small.
11. **Logs** — write to **stdout/stderr only**; let Docker capture them (json-file rotation from Phase 2.3). Never write app log files inside the container. ✓
12. **Admin processes** — run one-offs (DB migrations, scripts) as one-off processes against the same image, e.g.:
    ```bash
    docker compose -f /srv/apps/sina/project-a/docker-compose.yml run --rm app npm run migrate
    ```

The biggest practical wins for you: never bake secrets into images (factor 3),
keep the web tier stateless (factor 6), and run migrations and cron as separate
processes rather than wiring them into the web container (factors 8, 10, 12).

---

## Daily operations cheatsheet

```bash
docker ps
docker stats

# tail an app's logs
docker compose -f /srv/apps/sina/project-a/docker-compose.yml logs -f

# manual redeploy (CI normally does this)
cd /srv/apps/sina/project-a && docker compose pull && docker compose up -d

# run a migration (one-off process)
docker compose -f /srv/apps/sina/project-a/docker-compose.yml run --rm app npm run migrate

# reload Caddy after editing the Caddyfile
docker compose -f /srv/infra/proxy/docker-compose.yml up -d

free -h
```

---

## Roadmap recap

1. Phase 1 — OS hardening (don't skip swap).
2. Phase 2–3 — Docker + shared network + folder structure/permissions.
3. Phase 4–5 — Caddy + Postgres 18 up and healthy.
4. Phase 6–8 — deploy user, bot/GHCR, one project flowing end-to-end before adding more.
5. Phase 9 — backups, pruning, monitoring.
6. Phase 10–11 — schedule jobs as separate processes; keep apps 12-factor.
7. Replicate for the second user and remaining projects. Keep all config in git.
