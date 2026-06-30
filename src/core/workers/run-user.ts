import { prisma } from "@/db/client";
import { decryptSecret } from "@/lib/FUNC-crypto";
import { logger } from "@/lib/logger";
import {
  checkAndSendJobs,
  defaultGoatRules,
  type GoatRules,
  type JobMonitorConfig,
} from "@/core/workers/job-monitor";
import { ingestUserFeeds, ingestFeeds } from "@/core/workers/stats-ingest";
import { SentUrlCache } from "@/db/FUNC-dedup-repo";
import { scrapeLinkedInJobs, createExcelFile } from "@/services/scraper/FUNC-linkedin-scraper";
import { sendTelegramFileTo, sendTelegramMessageTo } from "@/services/telegram/FUNC-telegram";
import { parseRSSFeeds } from "@/services/rss/FUNC-rss-parser";
import { matchesCron } from "@/lib/FUNC-cron";

// ---- shared action result shape (test/send/run buttons) ---------------------
export type LogLevel = "success" | "error" | "warning" | "info";
export interface LogLine {
  level: LogLevel;
  message: string;
}
export interface ActionResult {
  ok: boolean;
  logs: LogLine[];
  data?: unknown;
}

/**
 * Per-user pipeline execution. Each function pulls the user's own feeds,
 * Telegram channels (decrypted), and GOAT config from the DB — nothing comes
 * from env. Driven by the /api/cron/tick scheduler below.
 */

interface Channel {
  botToken: string;
  chatId: string;
}

async function loadChannels(userId: string): Promise<{ main: Channel | null; goat: Channel | null }> {
  const rows = await prisma.notificationChannel.findMany({ where: { userId, active: true } });
  const pick = (kind: string): Channel | null => {
    const c = rows.find((r) => r.kind === kind);
    if (!c) return null;
    try {
      return { botToken: decryptSecret(c.botTokenEnc), chatId: c.chatId };
    } catch {
      logger.error(`Failed to decrypt ${kind} token for user ${userId}`);
      return null;
    }
  };
  return { main: pick("main"), goat: pick("goat") };
}

function goatRulesFor(config: {
  enabled: boolean;
  requireIndustry: boolean;
  requireCategory: boolean;
  categories: string[];
  industries: string[];
  seniorities: string[];
  companyBlacklist: string[];
  vipCompanies: string[];
  locationTerms: string[];
} | null): GoatRules {
  if (!config) return { ...defaultGoatRules(), enabled: false };
  return {
    enabled: config.enabled,
    requireIndustry: config.requireIndustry,
    requireCategory: config.requireCategory,
    categories: config.categories,
    industries: config.industries,
    seniorities: config.seniorities,
    companyBlacklist: config.companyBlacklist,
    vipCompanies: config.vipCompanies,
    locationTerms: config.locationTerms,
  };
}

/** Notification pipeline for one user: their notify-feeds → their Telegram. */
export async function runCheckJobsForUser(userId: string) {
  const [channels, feeds, goatConfig] = await Promise.all([
    loadChannels(userId),
    prisma.feed.findMany({ where: { userId, active: true, notify: true }, select: { url: true } }),
    prisma.goatConfig.findUnique({ where: { userId } }),
  ]);
  const main = channels.main;

  if (!main) return { skipped: "no main telegram channel" };
  if (feeds.length === 0) return { skipped: "no notify feeds" };

  const config: JobMonitorConfig = {
    feedUrls: feeds.map((f) => f.url),
    mainBotToken: main.botToken,
    mainChatId: main.chatId,
    goatBotToken: channels.goat?.botToken,
    goatChatId: channels.goat?.chatId,
    cacheKey: `u:${userId}:rss`,
    label: `user:${userId}`,
    // Tracking links record applications into this user's own applied store.
    appliedNamespace: userId,
    goat: goatRulesFor(goatConfig),
  };
  return checkAndSendJobs(config);
}

/** Ingest all the user's active feeds into the DB (personal + shared stats). */
export async function runStatsIngestForUser(userId: string) {
  return ingestUserFeeds(userId);
}

interface ScrapeSchedule {
  scrapeSearch: string | null;
  scrapeCountries: string | null;
  scrapeTimeFilter: number | null;
}

/** LinkedIn scrape for one user → Excel → their Telegram. */
export async function runScrapeForUser(userId: string, schedule: ScrapeSchedule) {
  const search = schedule.scrapeSearch?.trim();
  const countries = schedule.scrapeCountries?.trim();
  if (!search || !countries) return { skipped: "scrape search/countries not set" };

  const { main } = await loadChannels(userId);
  if (!main) return { skipped: "no main telegram channel" };

  const jobs = await scrapeLinkedInJobs({
    searchText: search,
    locationText: countries,
    timeFilter: schedule.scrapeTimeFilter ?? 604800,
  });
  if (jobs.length === 0) return { scraped: 0, sent: 0 };

  const cache = new SentUrlCache(`u:${userId}:scraper`);
  await cache.load();
  const newJobs = jobs.filter((j) => !cache.has(j.url));
  if (newJobs.length === 0) return { scraped: jobs.length, sent: 0, alreadyCached: jobs.length };

  const buffer = await createExcelFile(newJobs);
  for (const j of newJobs) cache.add(j.url, j.postedDate || undefined);
  await cache.save();

  const stamp = new Date().toISOString().split("T")[0];
  const filename = `linkedin_${newJobs.length}_${stamp}.xlsx`;
  const caption = `📊 LinkedIn scrape: ${newJobs.length} new jobs (${jobs.length - newJobs.length} cached)\nSearch: ${search}\nCountries: ${countries}`;
  await sendTelegramFileTo(main.botToken, main.chatId, buffer, filename, caption);

  return { scraped: jobs.length, sent: newJobs.length };
}

// ---- status helpers ---------------------------------------------------------

async function setFeedStatus(id: string, ok: boolean, error?: string | null) {
  await prisma.feed.update({
    where: { id },
    data: { lastStatus: ok ? "success" : "fail", lastTestedAt: new Date(), lastError: error ?? null },
  });
}
async function setChannelStatus(id: string, ok: boolean, error?: string | null) {
  await prisma.notificationChannel.update({
    where: { id },
    data: { lastStatus: ok ? "success" : "fail", lastTestedAt: new Date(), lastError: error ?? null },
  });
}

// ---- per-channel: test the bot connection -----------------------------------

export async function testChannelConnection(userId: string, channelId: string): Promise<ActionResult> {
  const logs: LogLine[] = [];
  const ch = await prisma.notificationChannel.findFirst({ where: { id: channelId, userId } });
  if (!ch) return { ok: false, logs: [{ level: "error", message: "channel not found" }] };

  let token: string;
  try {
    token = decryptSecret(ch.botTokenEnc);
  } catch {
    await setChannelStatus(ch.id, false, "token decrypt failed");
    return { ok: false, logs: [{ level: "error", message: "Failed to decrypt stored bot token" }] };
  }

  try {
    const meRes = await fetch(`https://api.telegram.org/bot${token}/getMe`);
    const me = (await meRes.json()) as { ok: boolean; result?: { username?: string; first_name?: string }; description?: string };
    if (!me.ok) {
      const m = me.description ?? "getMe failed";
      logs.push({ level: "error", message: `Bot authentication failed: ${m}` });
      await setChannelStatus(ch.id, false, m);
      return { ok: false, logs };
    }
    logs.push({ level: "success", message: `Bot OK: @${me.result?.username} (${me.result?.first_name})` });

    const sendRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: ch.chatId, text: "✅ JobCron test — this channel is connected." }),
    });
    const sent = (await sendRes.json()) as { ok: boolean; description?: string };
    if (!sent.ok) {
      const m = sent.description ?? "sendMessage failed";
      logs.push({ level: "warning", message: `Bot is valid but couldn't post to chat ${ch.chatId}: ${m}` });
      await setChannelStatus(ch.id, false, m);
      return { ok: false, logs };
    }
    logs.push({ level: "success", message: `Test message delivered to chat ${ch.chatId}` });
    await setChannelStatus(ch.id, true);
    return { ok: true, logs };
  } catch (e) {
    const m = e instanceof Error ? e.message : String(e);
    logs.push({ level: "error", message: m });
    await setChannelStatus(ch.id, false, m);
    return { ok: false, logs };
  }
}

// ---- per-feed: test fetch ---------------------------------------------------

export async function testFeedFetch(userId: string, feedId: string): Promise<ActionResult> {
  const logs: LogLine[] = [];
  const feed = await prisma.feed.findFirst({ where: { id: feedId, userId } });
  if (!feed) return { ok: false, logs: [{ level: "error", message: "feed not found" }] };

  const t0 = Date.now();
  try {
    const items = await parseRSSFeeds([feed.url]);
    const ms = Date.now() - t0;
    if (items.length === 0) {
      logs.push({ level: "warning", message: `Feed reachable but returned 0 items (${ms}ms)` });
      await setFeedStatus(feed.id, true);
      return { ok: true, logs, data: { count: 0 } };
    }
    logs.push({ level: "success", message: `Feed OK — ${items.length} items in ${ms}ms` });
    for (const it of items.slice(0, 3)) logs.push({ level: "info", message: `• ${it.title}` });
    await setFeedStatus(feed.id, true);
    return { ok: true, logs, data: { count: items.length } };
  } catch (e) {
    const m = e instanceof Error ? e.message : String(e);
    logs.push({ level: "error", message: `Fetch failed: ${m}` });
    await setFeedStatus(feed.id, false, m);
    return { ok: false, logs };
  }
}

// ---- per-feed: send to Telegram now + save to DB ----------------------------

export async function sendFeedNow(userId: string, feedId: string): Promise<ActionResult> {
  const logs: LogLine[] = [];
  const [feed, channels, goatConfig] = await Promise.all([
    prisma.feed.findFirst({ where: { id: feedId, userId } }),
    loadChannels(userId),
    prisma.goatConfig.findUnique({ where: { userId } }),
  ]);
  if (!feed) return { ok: false, logs: [{ level: "error", message: "feed not found" }] };
  if (!channels.main) {
    logs.push({ level: "error", message: "No main Telegram channel — add one in the Telegram tab first" });
    return { ok: false, logs };
  }

  try {
    const result = await checkAndSendJobs({
      feedUrls: [feed.url],
      mainBotToken: channels.main.botToken,
      mainChatId: channels.main.chatId,
      goatBotToken: channels.goat?.botToken,
      goatChatId: channels.goat?.chatId,
      cacheKey: `u:${userId}:rss`,
      label: `feed:${feed.id}`,
      appliedNamespace: userId,
      goat: goatRulesFor(goatConfig),
    });
    logs.push({ level: "success", message: `Telegram: ${result.sent} sent, ${result.total} scanned, ${result.failed} failed` });

    const ing = await ingestFeeds(userId, [{ url: feed.url, feedId: feed.id, shareToStats: feed.shareToStats }]);
    logs.push({ level: "success", message: `Database: ${ing.newJobs} new saved (${ing.skippedKnown} already known)` });

    await setFeedStatus(feed.id, true);
    return { ok: true, logs, data: { sent: result.sent, saved: ing.newJobs } };
  } catch (e) {
    const m = e instanceof Error ? e.message : String(e);
    logs.push({ level: "error", message: m });
    await setFeedStatus(feed.id, false, m);
    return { ok: false, logs };
  }
}

// ---- per-schedule: run now + record history ---------------------------------

export async function runScheduleNow(
  userId: string,
  scheduleId: string,
  trigger: "manual" | "cron" = "manual",
): Promise<ActionResult> {
  const logs: LogLine[] = [];
  const sched = await prisma.schedule.findFirst({ where: { id: scheduleId, userId } });
  if (!sched) return { ok: false, logs: [{ level: "error", message: "schedule not found" }] };

  const t0 = Date.now();
  let ok = false;
  let summary = "";
  let error: string | null = null;
  try {
    let result: unknown;
    if (sched.job === "check-jobs") result = await runCheckJobsForUser(userId);
    else if (sched.job === "stats-ingest") result = await runStatsIngestForUser(userId);
    else if (sched.job === "scrape") result = await runScrapeForUser(userId, sched);
    else throw new Error(`unknown job ${sched.job}`);
    ok = true;
    summary = JSON.stringify(result);
    logs.push({ level: "success", message: `${sched.job} ran: ${summary}` });
  } catch (e) {
    error = e instanceof Error ? e.message : String(e);
    logs.push({ level: "error", message: error });
    logger.error(`schedule ${sched.id} (${sched.job}) failed`, e);
  }
  const durationMs = Date.now() - t0;

  await prisma.$transaction([
    prisma.scheduleRun.create({
      data: { scheduleId: sched.id, userId, job: sched.job, ok, summary: summary || null, error, durationMs, trigger },
    }),
    prisma.schedule.update({
      where: { id: sched.id },
      data: { lastRunAt: new Date(), lastStatus: ok ? "success" : "fail", lastError: error },
    }),
  ]);

  return { ok, logs, data: { durationMs } };
}

// Advisory-lock coordinates for the multi-tenant tick. A fixed (namespace, id)
// pair shared by every replica; only the holder fires schedules each tick.
const TICK_LOCK_NS = 4099;
const TICK_LOCK_ID = 1;

/**
 * Scheduler tick: run every enabled schedule whose interval has elapsed since
 * lastRunAt. Each run records a ScheduleRun + updates status (via runScheduleNow).
 *
 * Cross-process safe: when several app replicas tick at once, only the one that
 * wins a Postgres advisory lock does the work; the others return immediately.
 * The lock is transaction-scoped (`pg_try_advisory_xact_lock`) so it can't leak —
 * it auto-releases when this gate transaction ends, even on crash. The actual job
 * runs on other pooled connections; the open transaction exists only to hold the
 * lock (needs a connection pool of >= 2, which is Prisma's default).
 */
export async function runDueSchedules(): Promise<{ ran: number; results: unknown[] }> {
  return prisma.$transaction(
    async (tx) => {
      // Cast to int4: Prisma binds JS numbers as bigint, but the two-arg lock
      // overload is pg_try_advisory_xact_lock(int, int) — without the casts
      // Postgres looks for a (bigint, bigint) overload that doesn't exist.
      const rows = await tx.$queryRaw<{ locked: boolean }[]>`
        SELECT pg_try_advisory_xact_lock(${TICK_LOCK_NS}::int, ${TICK_LOCK_ID}::int) AS locked
      `;
      if (!rows[0]?.locked) return { ran: 0, results: [] };
      return runDueSchedulesInner();
    },
    // Well under the route's maxDuration (300s); long enough to cover a full tick.
    { timeout: 290_000, maxWait: 10_000 },
  );
}

async function runDueSchedulesInner(): Promise<{ ran: number; results: unknown[] }> {
  const now = Date.now();
  const nowDate = new Date(now);
  const schedules = await prisma.schedule.findMany({ where: { enabled: true } });
  const due = schedules.filter((s) => {
    // Cron expression takes precedence: due when the current minute matches and
    // it hasn't already run this minute.
    if (s.cronExpr && s.cronExpr.trim()) {
      return matchesCron(s.cronExpr, nowDate) && (!s.lastRunAt || now - s.lastRunAt.getTime() >= 60_000);
    }
    return !s.lastRunAt || now - s.lastRunAt.getTime() >= s.intervalMinutes * 60_000;
  });

  // Run due schedules with a bounded worker pool so a minute where many users
  // come due at once can't open hundreds of simultaneous RSS/Telegram calls.
  // Cap = 20 concurrent; a shared cursor hands each worker the next schedule.
  // (Safe without a lock — increments happen between awaits on one event loop.)
  const results: unknown[] = [];
  const CONCURRENCY = 20;
  let cursor = 0;
  const worker = async () => {
    while (cursor < due.length) {
      const s = due[cursor++];
      const r = await runScheduleNow(s.userId, s.id, "cron");
      results.push({ scheduleId: s.id, job: s.job, ok: r.ok });
    }
  };
  await Promise.all(
    Array.from({ length: Math.min(CONCURRENCY, due.length) }, worker),
  );
  return { ran: due.length, results };
}

/**
 * Trim run-history tables so they don't grow unbounded. Keeps the last 30 days
 * of ScheduleRun + CronRun rows (history mini-page only ever shows the last 20).
 * Called from the cron tick.
 */
export async function pruneRunHistory(days = 30): Promise<{ scheduleRuns: number; cronRuns: number }> {
  const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const [sr, cr] = await prisma.$transaction([
    prisma.scheduleRun.deleteMany({ where: { createdAt: { lt: cutoff } } }),
    prisma.cronRun.deleteMany({ where: { createdAt: { lt: cutoff } } }),
  ]);
  if (sr.count || cr.count) {
    logger.info(`pruned run history: ${sr.count} schedule runs, ${cr.count} cron runs older than ${days}d`);
  }
  return { scheduleRuns: sr.count, cronRuns: cr.count };
}

/**
 * Drop the heavy `description` text from jobs older than `months` (default 6).
 * All analytical fields (title, dates, industry, keywords, salary, …) are kept
 * forever for the time-series stats; only the big text blob is cleared.
 */
export async function pruneOldDescriptions(months = 6): Promise<number> {
  const cutoff = new Date(Date.now() - months * 30 * 24 * 60 * 60 * 1000);
  const res = await prisma.job.updateMany({
    where: { extractedDate: { lt: cutoff }, NOT: { description: "" } },
    data: { description: "" },
  });
  if (res.count > 0) logger.info(`cleared ${res.count} job descriptions older than ${months} months`);
  return res.count;
}

/**
 * Delete accounts that never verified their email within 7 days. Keeps the
 * users table free of abandoned/spam signups. Called from the cron tick.
 */
export async function purgeUnverifiedUsers(): Promise<number> {
  const cutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const res = await prisma.user.deleteMany({
    where: { emailVerified: false, createdAt: { lt: cutoff } },
  });
  if (res.count > 0) logger.info(`purged ${res.count} unverified user(s) older than 7 days`);
  return res.count;
}

// Notify a user's main channel of an error (best-effort helper for routes).
export async function notifyUserError(userId: string, message: string): Promise<void> {
  const { main } = await loadChannels(userId);
  if (main) await sendTelegramMessageTo(main.botToken, main.chatId, message).catch(() => {});
}
