# Frontend Changes — Multi-Tenant Migration

This document tells the frontend what changes for the move from the old
single-user, cloud-(R2)-backed app to the new **multi-tenant server API**. Hand
this to the frontend agent.

> **Big picture:** the app is now multi-user. Every user has an account, logs in,
> and manages their **own** RSS feeds, Telegram channels, GOAT filters, and cron
> schedules in a **dashboard**. The public **Stats page** shows the union of all
> feeds users chose to share. The frontend no longer reads from R2/cloud — it
> calls this server's REST API with a JWT.

---

## Live URLs

- **API base (production):** `https://cron.polarislab.ir` — all calls go here, e.g.
  `https://cron.polarislab.ir/api/v1/stats/summary`. Put it in `NEXT_PUBLIC_API_BASE`.
- **Frontend origin:** `https://jobcron.vercel.app` (already in the server's
  `CORS_ALLOW_ORIGINS`).
- Dev: API at `http://localhost:3000`.

## 1. API base + auth model

- **API base URL:** `https://cron.polarislab.ir` in prod (`NEXT_PUBLIC_API_BASE`).
- **Auth:** JWT bearer token. After login you receive `{ token, user }`. Store the
  token (localStorage or an httpOnly cookie via your own BFF) and send it on every
  authenticated request:
  ```
  Authorization: Bearer <token>
  ```
- **CORS:** the server allows your origin when `CORS_ALLOW_ORIGINS` includes it.
  Tell ops your frontend origin.

### Auth endpoints

| Method | Path | Body | Returns |
|---|---|---|---|
| POST | `/api/auth/register` | `{ email, password, name? }` | `201 { token, user }` |
| POST | `/api/auth/login` | `{ email, password }` | `200 { token, user }` |
| GET | `/api/auth/me` | — (Bearer) | `{ user }` |

`user = { id, email, name, role }`.

### OAuth (Google / GitHub)

- Send the user to **`https://cron.polarislab.ir/api/auth/oauth/google`** or
  **`/api/auth/oauth/github`** (full-page navigation, not fetch). The server
  redirects to the provider. *(Only active once `GOOGLE_*`/`GITHUB_*` env vars are set.)*
- After consent, the server redirects back to:
  **`https://jobcron.vercel.app/auth/callback#token=<jwt>`** (or `#error=<msg>`).
- Build a `/auth/callback` page that reads the URL **fragment** (`window.location.hash`),
  extracts `token`, stores it, and redirects into the dashboard.

---

## 2. Dashboard (new)

A proper authenticated dashboard with tabs/pages. Suggested structure:

```
/dashboard
  ├── /account      Profile (email, name), logout
  ├── /feeds        Manage RSS feeds (personal + "share to stats")
  ├── /telegram     Telegram channels (main + GOAT bot tokens/chat ids)
  ├── /goat         GOAT filter rules
  └── /schedules    Cron times per pipeline
```

All dashboard calls require the `Authorization` header. A 401 = redirect to login.

### Feeds — `/api/me/feeds`

| Method | Path | Body | Notes |
|---|---|---|---|
| GET | `/api/me/feeds` | — | list user's feeds |
| POST | `/api/me/feeds` | `{ url, name?, notify?, shareToStats? }` | add feed |
| PATCH | `/api/me/feeds/{id}` | `{ name?, notify?, shareToStats?, active? }` | update |
| DELETE | `/api/me/feeds/{id}` | — | remove |

`feed = { id, url, name, notify, shareToStats, active, createdAt }`.
- `notify` = send matches to the user's Telegram.
- `shareToStats` = this feed's jobs appear in the **public** Stats page ("stat rss").
  Off = "personal rss" (private to the user).

### Telegram channels — `/api/me/channels`

| Method | Path | Body | Notes |
|---|---|---|---|
| GET | `/api/me/channels` | — | tokens returned **masked** only |
| POST | `/api/me/channels` | `{ kind, botToken, chatId, active? }` | create/replace |
| DELETE | `/api/me/channels/{id}` | — | remove |

- `kind` = `"main"` or `"goat"`. One of each per user.
- `botToken` is write-only — the server encrypts it; GET returns `botTokenMasked`
  (e.g. `1234…abcd`). Never display or expect the raw token back.

### GOAT filters — `/api/me/goat`

| Method | Path | Body |
|---|---|---|
| GET | `/api/me/goat` | — → `{ config }` (or `config: null`) |
| PUT | `/api/me/goat` | full config object (below) |

```ts
{
  enabled: boolean,
  requireIndustry: boolean,
  requireCategory: boolean,
  categories: string[],       // qualifying role categories
  industries: string[],       // e.g. ["Finance"]
  seniorities: string[],      // e.g. ["Mid","Entry"]
  companyBlacklist: string[],
  vipCompanies: string[],
  locationTerms: string[]     // required location substrings (e.g. UK terms)
}
```
UI: toggles for the booleans + tag/chip inputs for the arrays.

### Schedules — `/api/me/schedules`

| Method | Path | Body |
|---|---|---|
| GET | `/api/me/schedules` | — |
| POST | `/api/me/schedules` | `{ job, intervalMinutes, enabled?, scrapeSearch?, scrapeCountries?, scrapeTimeFilter? }` |
| PATCH | `/api/me/schedules/{id}` | partial |
| DELETE | `/api/me/schedules/{id}` | — |

- `job` = `"check-jobs"` | `"stats-ingest"` | `"scrape"` (one schedule each).
- `intervalMinutes` = how often it runs (min 5).
- The `scrape*` fields apply only to the `scrape` job (search terms, countries,
  time window seconds).

---

## 3. Stats page (data source change)

The Stats page no longer reads R2/cloud. It calls the server's per-component
endpoints, which aggregate the **shared** ("stat rss") jobs across all users.

Each chart calls its own endpoint; all accept shared filters + free-text search:

| Endpoint | Component |
|---|---|
| `/api/v1/stats/summary` | totals |
| `/api/v1/stats/industries` | Industry treemap |
| `/api/v1/stats/seniority` | Seniority waffle |
| `/api/v1/stats/experience` | Experience histogram |
| `/api/v1/stats/employers` | Employers bubble |
| `/api/v1/stats/locations` | World map (countries/regions/cities) |
| `/api/v1/stats/skills` | Skills word cloud |
| `/api/v1/stats/certifications` | Certs |
| `/api/v1/stats/timeline?series=industry` | Velocity stream / bump |
| `/api/v1/stats/heatmap` | Posting heatmap |
| `/api/v1/stats/hourly` | Time radial |
| `/api/v1/stats/salary` | Salary gauges |
| `/api/v1/stats/options` | filter dropdown values |
| `/api/v1/jobs` | job list/table (paginated) |
| `/api/v1/jobs/{id}` | one job's description |

**Shared filters (query params, all optional):**
`from`,`to` (ISO) or `month` (YYYY-MM); `industry`,`seniority`,`country`,`region`,
`city`,`roleType`,`roleCategory`,`company`; tag facets `keyword`,`certificate`,
`software`,`programming`,`degree`; numeric `salaryMin`,`salaryMax`,`expMin`,`expMax`;
free-text `q` (matches a word inside title/company/location/description);
`limit`; and for `/jobs`: `page`,`pageSize`,`sort`,`order`,`withDescription`.

Response shape: `{ success: true, metric, data }` for stats, `{ success, total, page, pageSize, totalPages, jobs }` for `/jobs`.

> **Scope (live):** every stats + `/jobs` endpoint takes `scope=public` (default —
> the shared "stat rss" union across all users, deduped by job URL) or `scope=me`
> (the logged-in user's own jobs; requires the `Authorization` header). Use
> `scope=me` for a personal stats view, `public` for the global Stats page.

---

## 4. What to build now vs later

**Build now (server-ready):**
- Login / Register / OAuth callback pages + token storage + auth guard.
- Dashboard shell with the 5 tabs and all the CRUD above.
- Re-point the existing Stats page from R2/cloud to `/api/v1/stats/*` + `/api/v1/jobs`.

**Server-side: all live.** Per-user cron tick (P2), personal stats scope (P3,
`scope=me`), and the g2 backfill (P4) are all deployed. The dashboard API
contract above is final.

---

## 4b. Admin page — g2 backfill button

An **admin-only** page with an "Import g2 data" button. Only users with
`role: "admin"` should see it (their `/api/auth/me` returns the role).

**Endpoint:** `POST https://cron.polarislab.ir/api/admin/backfill-r2`
- **Auth:** `Authorization: Bearer <admin JWT>` — the server re-checks `role=admin` in the DB (403 otherwise).
- **Body:** the old R2 credentials, forwarded by the frontend host:
  ```json
  { "accountId": "...", "accessKeyId": "...", "secretAccessKey": "...", "bucket": "..." }
  ```
- **Response:** `{ "success": true, "months": N, "days": N, "read": N, "inserted": N }`

**Important — keep R2 secrets server-side.** The button must NOT put R2 secrets
in the browser. Flow:
1. Button → calls the **frontend's own** API route (Next.js server / Vercel function).
2. That route reads the R2 secrets from **its env** and forwards them (+ the
   admin's JWT) to the cron-server endpoint above. Server-to-server over HTTPS;
   the browser never sees the secrets.
3. Show the returned counts. It's **idempotent** — safe to click again (existing
   jobs are skipped); re-click if it times out on a large history.

The imported jobs are marked shared-to-stats, so they appear on the public Stats
page for everyone, owned by the admin who ran the import.

## 5. Migration notes for the frontend

- Remove all direct R2 / cloud fetch code; replace with `fetch(`${API_BASE}/...`)`.
- Centralize an API client that injects the bearer token and handles 401 → logout.
- Env: `NEXT_PUBLIC_API_BASE` (server URL). For OAuth, the server needs
  `FRONTEND_URL` pointed at this app's origin (ops sets that server-side).
