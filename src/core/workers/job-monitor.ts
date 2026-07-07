import { CronJobResult, JobItem } from "@/types/job";
import { parseRSSFeeds, filterRecentJobs } from "@/services/rss/FUNC-rss-parser";
import { formatJobMessage } from "@/services/telegram/FUNC-job-formatter";
import { sendMessagesWithRateLimitTo } from "@/services/telegram/FUNC-telegram";
import { logger } from "@/lib/logger";
import { SentUrlCache } from "@/db/FUNC-dedup-repo";
import type { AppliedNamespace } from "@/types/applied-job";
import {
  RSS_FEED_URLS,
  CHECK_INTERVAL_MINUTES,
  RATE_LIMIT_DELAY_MS,
  TELEGRAM_BOT_TOKEN,
  TELEGRAM_CHAT_ID,
  GOAT_TELEGRAM_BOT_TOKEN,
  GOAT_TELEGRAM_CHAT_ID,
} from "@/config/constants";

export interface JobMonitorConfig {
  feedUrls: string[];
  mainBotToken: string | undefined;
  mainChatId: string | undefined;
  filteredBotToken: string | undefined;
  filteredChatId: string | undefined;
  cacheKey: string;
  label: string;
  appliedNamespace: AppliedNamespace;
  /** JFS filter sets — a job matching ANY enabled set goes to the filtered channel. */
  filterSets: FilterSetData[];
}

import { LocationExtractor } from "@/analysis/FUNC-location-extractor";
import { getCountryFromUrlTLD, resolvePostedDate } from "@/analysis/FUNC-company-location-lookup";
import { matchesAnyFilterSet, type FilterSetData } from "@/core/FUNC-filter-eval";
import { analyzeRssJob, ingestParsedJobs } from "@/core/workers/stats-ingest";

/**
 * JFS: true if the job matches any of the user's enabled filter sets. The job is
 * fully analysed once (same extractor pipeline as the stats ingest) and the
 * conditions are evaluated against it.
 */
function isFiltered(job: JobItem, sets: FilterSetData[]): boolean {
  if (sets.length === 0) return false;
  const analyzed = analyzeRssJob(job);
  if (!analyzed) return false;
  return matchesAnyFilterSet(analyzed, sets);
}

// Feed URL that should only send Europe and Canada jobs
const EUROPE_CANADA_ONLY_FEED = "https://rss.app/feeds/cbDOTKxD2MnLmSzW.xml";

// Allowed countries for the filtered feed (Europe + Canada)
const ALLOWED_COUNTRIES = new Set([
  // European countries (canonical names from countries.ts)
  "United Kingdom",
  "Germany",
  "France",
  "Italy",
  "Spain",
  "Netherlands",
  "Belgium",
  "Switzerland",
  "Austria",
  "Poland",
  "Czech Republic",
  "Sweden",
  "Norway",
  "Denmark",
  "Finland",
  "Ireland",
  "Portugal",
  "Greece",
  "Hungary",
  "Romania",
  "Bulgaria",
  "Ukraine",
  "Russia",
  "Serbia",
  "Croatia",
  "Slovenia",
  "Slovakia",
  "Lithuania",
  "Latvia",
  "Estonia",
  "Cyprus",
  "Malta",
  "Iceland",
  "Luxembourg",
  "Monaco",
  "Andorra",
  "Liechtenstein",
  "San Marino",
  "Vatican City",
  "Albania",
  "North Macedonia",
  "Montenegro",
  "Bosnia and Herzegovina",
  "Moldova",
  "Belarus",
  // Canada
  //'Canada',
]);

/**
 * Filter jobs from specific feeds based on location
 * For EUROPE_CANADA_ONLY_FEED, only allow jobs from Europe or Canada
 * Uses LocationExtractor which finds countries via direct match, city lookup, or state lookup
 * Returns { filtered: JobItem[], removedCount: number }
 */
function filterJobsByFeedLocation(jobs: JobItem[]): {
  filtered: JobItem[];
  removedCount: number;
} {
  let removedCount = 0;

  const filtered = jobs.filter((job) => {
    // Only apply filter to the specific feed
    if (job.sourceUrl !== EUROPE_CANADA_ONLY_FEED) {
      return true; // Allow all jobs from other feeds
    }

    // Use LocationExtractor to extract country (handles cities, states, and direct country matches)
    const locationData = LocationExtractor.extractLocation(
      job.location || "",
      job.link,
      job.title,
      job.description,
    );

    // Allow if country is in the allowed list
    if (locationData.country && ALLOWED_COUNTRIES.has(locationData.country)) {
      return true;
    }

    removedCount++;
    logger.info(
      `Filtering out job from ${EUROPE_CANADA_ONLY_FEED}: ${job.title} (location: ${job.location || "unknown"}, detected country: ${locationData.country || "unknown"}, city: ${locationData.city || "unknown"})`,
    );
    return false;
  });

  return { filtered, removedCount };
}

/**
 * Deduplicate jobs based on URL
 * A job is considered duplicate if its URL matches an already seen job
 * Only URLs containing "http" are considered valid
 */
function deduplicateJobs(jobs: JobItem[]): JobItem[] {
  const seenUrls = new Set<string>();
  const uniqueJobs: JobItem[] = [];

  for (const job of jobs) {
    const normalizedUrl = job.link.toLowerCase().trim();

    // Skip jobs with invalid URLs (must contain http)
    if (!normalizedUrl.includes("http")) {
      logger.warn(
        `Skipping job with invalid URL: "${job.link}" - ${job.title}`,
      );
      continue;
    }

    // Skip if URL has been seen before
    if (!seenUrls.has(normalizedUrl)) {
      seenUrls.add(normalizedUrl);
      uniqueJobs.push(job);
    }
  }

  return uniqueJobs;
}

/**
 * Main service for checking RSS feeds and sending job notifications
 */
/** Legacy single-tenant main config from env (for /api/cron/check-jobs). */
export function defaultMainConfig(): JobMonitorConfig {
  return {
    feedUrls: RSS_FEED_URLS,
    mainBotToken: TELEGRAM_BOT_TOKEN,
    mainChatId: TELEGRAM_CHAT_ID,
    filteredBotToken: GOAT_TELEGRAM_BOT_TOKEN,
    filteredChatId: GOAT_TELEGRAM_CHAT_ID,
    cacheKey: "url-rss",
    label: "main",
    appliedNamespace: "default",
    // Legacy env pipeline has no JFS sets; nothing routed to the filtered channel.
    filterSets: [],
  };
}

export async function checkAndSendJobs(config: JobMonitorConfig): Promise<CronJobResult> {
  logger.info(`Starting job check [${config.label}]...`);

  if (!config.mainBotToken || !config.mainChatId) {
    throw new Error(
      `[${config.label}] main Telegram bot token / chat id not configured`,
    );
  }

  try {
    // Parse all RSS feeds
    const allJobs = await parseRSSFeeds(config.feedUrls);
    logger.info(
      `Fetched ${allJobs.length} total jobs from ${config.feedUrls.length} feeds`,
    );

    // Persist every parsed job to the public stats DB (deduped by url), independent
    // of the Telegram recency/cache filters below. This is what keeps the stats
    // page in sync with the monitored feeds. Non-fatal: never block notifications.
    try {
      await ingestParsedJobs(allJobs);
    } catch (e) {
      logger.warn("stats ingest during check-jobs failed (non-fatal)", e);
    }

    // Extract all publication dates from found jobs
    const pubDates = allJobs.map((job) => job.pubDate);

    // Deduplicate jobs based on title
    const uniqueJobs = deduplicateJobs(allJobs);
    logger.info(
      `After deduplication: ${uniqueJobs.length} unique jobs (removed ${allJobs.length - uniqueJobs.length} duplicates)`,
    );

    // Filter jobs by feed-specific location rules (Europe/Canada only for specific feed)
    const {
      filtered: locationFilteredJobs,
      removedCount: locationFilteredCount,
    } = filterJobsByFeedLocation(uniqueJobs);
    logger.info(
      `After location filter: ${locationFilteredJobs.length} jobs (removed ${locationFilteredCount} non-Europe/Canada jobs from filtered feed)`,
    );

    // Filter for recent jobs
    const recentJobs = filterRecentJobs(
      locationFilteredJobs,
      CHECK_INTERVAL_MINUTES,
    );
    logger.info(
      `Found ${recentJobs.length} recent jobs (within ${CHECK_INTERVAL_MINUTES} minutes)`,
    );

    // Load persistent cache and filter out already cached jobs
    const urlCache = new SentUrlCache(config.cacheKey);
    await urlCache.load();

    logger.info(`\n=== Cache Check Before Sending to Telegram ===`);
    logger.info(`Recent jobs to check: ${recentJobs.length}`);
    logger.info(`URLs already in cache: ${urlCache.size()}`);

    // Filter out jobs that have already been sent (using persistent cache)
    const newJobs = recentJobs.filter((job) => {
      const normalizedUrl = job.link.toLowerCase().trim();
      if (urlCache.has(normalizedUrl)) {
        logger.info(`✗ Filtering out cached job: ${normalizedUrl}`);
        return false;
      }
      return true;
    });

    logger.info(
      `Jobs after cache filter: ${newJobs.length} (filtered out ${recentJobs.length - newJobs.length} already cached)`,
    );

    // If no new jobs, return early
    if (newJobs.length === 0) {
      logger.info("No new jobs to send - all already cached");
      return {
        total: allJobs.length,
        sent: 0,
        failed: 0,
        pubDates,
        locationFiltered: locationFilteredCount,
      };
    }

    // Format messages and pre-compute JFS match (filtered channel) for each job
    const filterSets = config.filterSets;
    const jobMessages = newJobs.map((job) => ({
      message: formatJobMessage(job, { namespace: config.appliedNamespace }),
      isFiltered: isFiltered(job, filterSets),
    }));
    const messages = jobMessages.map((jm) => jm.message);

    // Send messages with rate limiting to main channel
    const { sent, failed } = await sendMessagesWithRateLimitTo(
      config.mainBotToken,
      config.mainChatId,
      messages,
      RATE_LIMIT_DELAY_MS,
    );

    // CRITICAL: Only mark SUCCESSFULLY sent jobs in the persistent cache
    // Failed jobs should NOT be cached so they can be retried
    if (sent > 0) {
      const sentJobs = newJobs.slice(0, sent);
      for (const job of sentJobs) {
        const normalizedUrl = job.link.toLowerCase().trim();
        // Use pubDate as the timestamp for 48-hour expiry calculation
        // This ensures URLs expire based on when the job was posted, not when we cached it
        urlCache.add(normalizedUrl, resolvePostedDate(job.pubDate));
        logger.info(
          `✓ Added to cache after successful send: ${normalizedUrl} (pubDate: ${job.pubDate})`,
        );
      }
      await urlCache.save();
      logger.info(`Cache saved with ${urlCache.size()} total URLs`);
    }

    // Log failed jobs for debugging
    if (failed > 0) {
      logger.warn(
        `${failed} jobs failed to send and will be retried in next run`,
      );
    }

    // Filtered channel (JFS): send jobs that matched a filter set, from the batch.
    if (sent > 0 && config.filteredBotToken && config.filteredChatId) {
      const filteredMessages = jobMessages
        .slice(0, sent)
        .filter((jm) => jm.isFiltered)
        .map((jm) => jm.message);

      if (filteredMessages.length > 0) {
        logger.info(`[${config.label}] Sending ${filteredMessages.length} JFS-matched jobs to filtered channel`);
        const filteredResult = await sendMessagesWithRateLimitTo(
          config.filteredBotToken,
          config.filteredChatId,
          filteredMessages,
          RATE_LIMIT_DELAY_MS,
        );
        logger.info(`[${config.label}] filtered channel: ${filteredResult.sent} sent, ${filteredResult.failed} failed`);
      } else {
        logger.info(`[${config.label}] No JFS-matched jobs in this batch`);
      }
    }

    logger.info(`Job check completed: ${sent} sent, ${failed} failed`);

    return {
      total: allJobs.length,
      sent,
      failed,
      pubDates,
      locationFiltered: locationFilteredCount,
    };
  } catch (error) {
    logger.error("Error in checkAndSendJobs:", error);
    throw error;
  }
}
