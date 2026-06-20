# Jobs Cron Server

Backend server that runs the LinkedIn/RSS job pipelines on a schedule and serves
their data. Ported from the original browser-side app into a clean, layered
**Next.js + TypeScript + Prisma/PostgreSQL** server. The existing frontend stays
where it is and calls these APIs over HTTP (CORS enabled).

Built to the security + architecture rules in `principles.txt` (SSRF/XXE guards,
fail-fast validation, parameterised ORM queries, layered architecture, structured
trace logging) and the layout in `structure.txt`.

## File naming convention

- **`FUNC-{name}.ts`** — modules that *define* functions/classes (extractors,
  services, repositories). Example: `analysis/FUNC-salary-extractor.ts`.
- **`{name}.ts`** — modules that *use/compose* those functions (route handlers,
  `core/workers/*` orchestrators, config, types).

## The 4 cron endpoints (called by the external cron service)

| Endpoint | What it does |
| --- | --- |
| `GET /api/cron/check-jobs` | Main pipeline: fetch RSS → analyse → Telegram (+ GOAT channel). Bearer-protected. |
| `GET /api/cron/check-jobs-aryan` | Same pipeline with the Aryan feeds/bots and relaxed GOAT gates. |
| `GET /api/scrape-jobs-stream?search=&countries=&timeFilter=` | LinkedIn scrape (SSE progress) → Excel → Telegram. |
| `GET /api/stats/get` | Ingest stats RSS feeds into Postgres, return aggregated summary. |

All are `Authorization: Bearer <CRON_SECRET>` protected and rate-limited per IP.

## Architecture (strict directional dependency)

```
app/ (API routes)  ─ ingress, auth, response shaping
  └─> core/workers/ ─ orchestrators (job-monitor, stats-ingest)
        ├─> services/  rss (SSRF/XXE), telegram, scraper      ← egress
        ├─> analysis/  extractors (FUNC-*) + dictionaries     ← pure logic
        └─> db/        Prisma repo + dedup ledger             ← persistence
  lib/ logger · ssrf-guard · validation · progress-emitter · tracking-url
```

## Data model (Postgres / Prisma — built for the stats page)

`prisma/schema.prisma`:

- **`Job`** — one row per analysed posting. Every stats-page component maps to a
  query over this table: scalar facets (industry, seniority, country, region,
  role) are B-tree indexed; multi-value tags (keywords, certificates, software,
  programmingSkills, academicDegrees) are **GIN-indexed `text[]`** for fast
  `has/hasSome` filtering + `unnest` aggregation; `extractedDate`/`postedDate`
  drive time-series; composite indexes back time-series-by-facet charts.
- **`SentUrl`** — dedup ledger (replaces the old R2 url-cache), namespaced per
  pipeline, 48h per-URL expiry.
- **`CronRun`** — per-run history for tracing (reserved for run logging).

## Local development

```bash
pnpm install                 # also runs `prisma generate`
cp .env.example .env         # fill DATABASE_URL, CRON_SECRET, feeds, bot tokens
pnpm db:migrate:dev          # create jobs / sent_urls / cron_runs tables
pnpm dev                     # http://localhost:3000
```

Trigger locally:

```bash
curl -H "Authorization: Bearer $CRON_SECRET" http://localhost:3000/api/cron/check-jobs
curl -H "Authorization: Bearer $CRON_SECRET" "http://localhost:3000/api/stats/get"
```

## Security defenses

| Threat | Defense | Where |
| --- | --- | --- |
| SSRF | DNS-resolve + IP blocklist before every feed fetch | `lib/ssrf-guard.ts`, `services/rss/FUNC-rss-parser.ts` |
| XXE | reject DOCTYPE/ENTITY bodies | `services/rss/FUNC-rss-parser.ts` |
| SQL injection | Prisma parameterised queries (raw aggregates use whitelisted identifiers) | `db/*` |
| Auth | constant-time bearer check | `lib/validation.ts` |
| Abuse | per-IP rate limit + CORS allow-list | `middleware.ts` |
| Duplicate notifications | Postgres dedup ledger (48h) | `db/FUNC-dedup-repo.ts` |
| Secret leakage | key redaction in structured logs | `lib/logger.ts` |

## Deployment — GitHub Actions → server

`.github/workflows/deploy.yml`: on push to `main`, CI typechecks + builds, then
SSHes in and runs `git reset --hard` → install → `prisma migrate deploy` → build
→ `pm2 reload`. See the secrets table below and the monorepo note.

| Secret | Meaning |
| --- | --- |
| `SSH_HOST` / `SSH_USER` / `SSH_KEY` / `SSH_PORT` | server SSH access |
| `DEPLOY_PATH` | repo path on the server |

> **Note:** the reference copy of the original app under
> `the project we are trying to implement to this server/` is git-ignored and not
> part of this server — it's kept only for porting reference.
>
> **Monorepo note:** GitHub Actions runs workflows from the *repo root*
> `.github/workflows/`. This folder is inside the `website` repo, so either make
> `cron-server/` its own repo or move the workflow to the root with `cd cron-server`.

## Stats / RSS read APIs (per-component, filter + search)

Every stats-page component calls its own endpoint, so the frontend never pulls
one giant payload. All accept the **shared filters** (query params):

- **time**: `from`/`to` (ISO) or `month` (YYYY-MM)
- **scalar facets** (exact): `industry` `seniority` `country` `region` `city`
  `roleType` `roleCategory` `company`
- **tag facets** (contains-any): `keyword` `certificate` `software` `programming` `degree`
- **numeric ranges**: `salaryMin` `salaryMax` `expMin` `expMax`
- **free text**: `q` — matches a **word inside** `title`/`company`/`location`/
  `description` (trigram-indexed ILIKE)
- `limit`, pagination/sort (jobs)

Filter parsing/validation: `lib/FUNC-stats-filters.ts` (Zod).

| Endpoint | Component |
| --- | --- |
| `GET /api/v1/stats/summary` | totals |
| `GET /api/v1/stats/options` | filter dropdown values |
| `GET /api/v1/stats/industries` | Industry treemap |
| `GET /api/v1/stats/seniority` | Seniority waffle |
| `GET /api/v1/stats/experience` | Experience-years histogram |
| `GET /api/v1/stats/roles` · `/role-types` | role facets |
| `GET /api/v1/stats/employers` | Employers bubble |
| `GET /api/v1/stats/locations` | World map (countries/regions/cities) |
| `GET /api/v1/stats/skills` | Skills word cloud (keywords/software/programming) |
| `GET /api/v1/stats/certifications` | Certs |
| `GET /api/v1/stats/timeline?series=industry` | Velocity stream / Certs bump |
| `GET /api/v1/stats/heatmap` | Posting heatmap (dow × hour) |
| `GET /api/v1/stats/hourly` | Time radial |
| `GET /api/v1/stats/salary` | Salary gauges |
| `GET /api/v1/jobs` | paginated/filtered/searched job list (rss page + table) |
| `GET /api/v1/jobs/{id}` | on-demand job description |

Scalar facets use Prisma `groupBy`; tag facets + time buckets use parameterised
`$queryRaw` over the GIN/B-tree indexes (`db/FUNC-stats-repo.ts`).

## Status

✅ **Milestone 1** — cron + analysis pipeline on Postgres (4 cron endpoints).
✅ **Milestone 2** — per-component stats + rss read APIs (filter / search /
time-series). All build & typecheck.
✅ **Schema finalized** — numeric `experienceYears` (range-filterable), `pg_trgm`
trigram GIN on all text columns (word-inside search), salary range filters.
⏭️ Next: `pnpm db:migrate:dev` to create the schema, then point the frontend
components at these endpoints.
```
