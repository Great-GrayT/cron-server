import { prisma } from "@/db/client";
import { decryptSecret } from "@/lib/FUNC-crypto";
import { logger } from "@/lib/logger";
import {
  checkAndSendJobs,
  defaultGoatRules,
  type GoatRules,
  type JobMonitorConfig,
} from "@/core/workers/job-monitor";
import { ingestUserFeeds } from "@/core/workers/stats-ingest";
import { SentUrlCache } from "@/db/FUNC-dedup-repo";
import { scrapeLinkedInJobs, createExcelFile } from "@/services/scraper/FUNC-linkedin-scraper";
import { sendTelegramFileTo, sendTelegramMessageTo } from "@/services/telegram/FUNC-telegram";

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
    appliedNamespace: "default",
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

/**
 * Scheduler tick: run every enabled schedule whose interval has elapsed since
 * lastRunAt. Each run is isolated; lastRunAt advances regardless of outcome so
 * a failing job doesn't hammer on every tick.
 */
export async function runDueSchedules(): Promise<{ ran: number; results: unknown[] }> {
  const now = Date.now();
  const schedules = await prisma.schedule.findMany({ where: { enabled: true } });

  const due = schedules.filter(
    (s) => !s.lastRunAt || now - s.lastRunAt.getTime() >= s.intervalMinutes * 60_000,
  );

  const results: unknown[] = [];
  for (const s of due) {
    try {
      let result: unknown;
      if (s.job === "check-jobs") result = await runCheckJobsForUser(s.userId);
      else if (s.job === "stats-ingest") result = await runStatsIngestForUser(s.userId);
      else if (s.job === "scrape") result = await runScrapeForUser(s.userId, s);
      else result = { skipped: `unknown job ${s.job}` };
      results.push({ scheduleId: s.id, userId: s.userId, job: s.job, ok: true, result });
    } catch (error) {
      logger.error(`schedule ${s.id} (${s.job}) failed`, error);
      results.push({ scheduleId: s.id, job: s.job, ok: false, error: String(error) });
    } finally {
      await prisma.schedule.update({ where: { id: s.id }, data: { lastRunAt: new Date() } });
    }
  }

  return { ran: due.length, results };
}

// Notify a user's main channel of an error (best-effort helper for routes).
export async function notifyUserError(userId: string, message: string): Promise<void> {
  const { main } = await loadChannels(userId);
  if (main) await sendTelegramMessageTo(main.botToken, main.chatId, message).catch(() => {});
}
