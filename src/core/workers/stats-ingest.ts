import { parseRSSFeeds } from "@/services/rss/FUNC-rss-parser";
import { JobMetadataExtractor } from "@/analysis/FUNC-job-metadata-extractor";
import { SalaryExtractor } from "@/analysis/FUNC-salary-extractor";
import { LocationExtractor } from "@/analysis/FUNC-location-extractor";
import { extractJobDetails, analyzeJobDescription } from "@/analysis/FUNC-job-analyzer";
import { RoleTypeExtractor } from "@/analysis/FUNC-role-type-extractor";
import { softwareKeywords } from "@/analysis/dictionaries/software";
import { programmingKeywords } from "@/analysis/dictionaries/programming-languages";
import { findExistingUrls, insertJobs, getSystemUserId, type JobOwner } from "@/db/FUNC-jobs-repo";
import { prisma } from "@/db/client";
import { RSS_STATS_FEED_URLS } from "@/config/constants";
import { logger } from "@/lib/logger";
import type { JobItem } from "@/types/job";
import type { JobRegion, JobStatistic } from "@/types/stats";

export interface StatsIngestResult {
  processed: number;
  newJobs: number;
  skippedKnown: number;
}

/** One feed to ingest, with the ownership flags applied to its jobs. */
export interface FeedDef {
  url: string;
  feedId: string | null;
  shareToStats: boolean;
}

/**
 * Run the full analysis pipeline on a single RSS item → a JobStatistic.
 * Pure (no DB); returns null if extraction throws.
 */
export function analyzeRssJob(rssJob: JobItem): JobStatistic | null {
  try {
    const jobDetails = extractJobDetails(rssJob.title);
    const finalCompany =
      jobDetails.company !== "N/A" ? jobDetails.company : rssJob.company || "Unknown Company";
    const finalPosition = jobDetails.position;
    const extractedLocation = jobDetails.location !== "N/A" ? jobDetails.location : null;

    let locationData: { country: string | null; city: string | null; region: JobRegion | null } = {
      country: null,
      city: null,
      region: null,
    };
    if (extractedLocation) {
      locationData = LocationExtractor.extractLocation(extractedLocation, rssJob.link, null, "");
    }
    if (!locationData.country && !locationData.city) {
      locationData = LocationExtractor.extractLocation(
        rssJob.title,
        rssJob.link,
        rssJob.location ?? null,
        rssJob.description || "",
      );
    }
    const formattedLocation = extractedLocation || LocationExtractor.formatLocation(locationData);

    const metadata = JobMetadataExtractor.extractAllMetadata({
      title: finalPosition,
      company: finalCompany,
      description: rssJob.description || "",
      url: rssJob.link,
    });

    let salary = SalaryExtractor.extractSalary(rssJob.title, rssJob.description || "");
    if (salary) salary = SalaryExtractor.normalizeToAnnual(salary);

    const description = rssJob.description || "";
    const software: string[] = [];
    for (const [soft, pattern] of Object.entries(softwareKeywords)) {
      if (pattern.test(description)) software.push(soft);
      pattern.lastIndex = 0;
    }
    const programmingSkills: string[] = [];
    for (const [skill, pattern] of Object.entries(programmingKeywords)) {
      if (pattern.test(description)) programmingSkills.push(skill);
      pattern.lastIndex = 0;
    }

    const analysis = analyzeJobDescription(description);
    let experienceYears: number | null = null;
    if (analysis.yearsExperience) {
      const m = analysis.yearsExperience.match(/(\d+)/);
      if (m) {
        const y = parseInt(m[1], 10);
        if (y >= 0 && y <= 15) experienceYears = y;
      }
    }

    const roleTypeMatch = RoleTypeExtractor.extractRoleType(
      finalPosition,
      metadata.keywords,
      description,
      metadata.industry,
    );

    return {
      id: metadata.id,
      title: rssJob.title,
      company: finalCompany,
      location: rssJob.location || formattedLocation,
      country: locationData.country,
      city: locationData.city,
      region: locationData.region,
      url: rssJob.link,
      postedDate: rssJob.pubDate,
      extractedDate: new Date().toISOString(),
      keywords: metadata.keywords,
      certificates: metadata.certificates,
      industry: metadata.industry,
      seniority: metadata.seniority,
      description,
      salary,
      software,
      programmingSkills,
      experienceYears,
      academicDegrees: analysis.academicDegrees,
      roleType: roleTypeMatch?.roleType || null,
      roleCategory: roleTypeMatch?.category || null,
    };
  } catch (error) {
    logger.error(`Error processing job: ${rssJob.title}`, error);
    return null;
  }
}

/**
 * Ingest a set of feeds for one user. Dedup is per-user (a single batched
 * query); each job inherits its feed's `feedId` + `shareToStats`.
 */
export async function ingestFeeds(userId: string, feeds: FeedDef[]): Promise<StatsIngestResult> {
  if (feeds.length === 0) return { processed: 0, newJobs: 0, skippedKnown: 0 };

  const byUrl = new Map(feeds.map((f) => [f.url, f]));
  const allJobs = await parseRSSFeeds(feeds.map((f) => f.url));
  const candidates = allJobs.filter((j) => j.link && j.link.includes("http"));

  const existing = await findExistingUrls(userId, candidates.map((j) => j.link));

  // Bucket new jobs by their owning feed so each insert carries the right flags.
  const buckets = new Map<string, { owner: JobOwner; jobs: JobStatistic[] }>();
  let processed = 0;
  let skippedKnown = 0;

  for (const rssJob of candidates) {
    processed++;
    if (existing.has(rssJob.link)) {
      skippedKnown++;
      continue;
    }
    const feed = byUrl.get(rssJob.sourceUrl ?? "") ?? feeds[0];
    const stat = analyzeRssJob(rssJob);
    if (!stat) continue;
    const key = feed.feedId ?? feed.url;
    if (!buckets.has(key)) {
      buckets.set(key, { owner: { userId, feedId: feed.feedId, shareToStats: feed.shareToStats }, jobs: [] });
    }
    buckets.get(key)!.jobs.push(stat);
  }

  let newJobs = 0;
  for (const { owner, jobs } of buckets.values()) {
    newJobs += await insertJobs(jobs, owner);
  }

  logger.info(`Ingest [user ${userId}]: processed ${processed}, inserted ${newJobs}, skipped ${skippedKnown}`);
  return { processed, newJobs, skippedKnown };
}

/**
 * Persist an already-parsed batch of RSS items into the public stats DB, deduped
 * by url against what the system account has seen. Used by the check-jobs
 * (Telegram) pipeline so every monitored job lands in stats — independent of the
 * Telegram recency/cache filters. Only NEW urls are analysed + inserted, so
 * steady-state runs are cheap.
 */
export async function ingestParsedJobs(items: JobItem[]): Promise<StatsIngestResult> {
  const candidates = items.filter((j) => j.link && j.link.includes("http"));
  if (candidates.length === 0) return { processed: 0, newJobs: 0, skippedKnown: 0 };

  const userId = await getSystemUserId();
  const existing = await findExistingUrls(userId, candidates.map((j) => j.link));

  const stats: JobStatistic[] = [];
  let processed = 0;
  let skippedKnown = 0;
  for (const rssJob of candidates) {
    processed++;
    if (existing.has(rssJob.link)) {
      skippedKnown++;
      continue;
    }
    const stat = analyzeRssJob(rssJob);
    if (stat) stats.push(stat);
  }

  const newJobs = await insertJobs(stats, { userId, feedId: null, shareToStats: true });
  logger.info(`Stats ingest (check-jobs): processed ${processed}, inserted ${newJobs}, skipped ${skippedKnown}`);
  return { processed, newJobs, skippedKnown };
}

/** Ingest all of a user's active feeds (dashboard-managed). */
export async function ingestUserFeeds(userId: string): Promise<StatsIngestResult> {
  const feeds = await prisma.feed.findMany({
    where: { userId, active: true },
    select: { id: true, url: true, shareToStats: true },
  });
  return ingestFeeds(
    userId,
    feeds.map((f) => ({ url: f.url, feedId: f.id, shareToStats: f.shareToStats })),
  );
}

/**
 * Legacy single-tenant ingest (/api/stats/get): the env RSS_STATS_FEED_URLS,
 * attributed to the reserved system account and shared to public stats.
 */
export async function ingestStatsFromRss(): Promise<StatsIngestResult> {
  const userId = await getSystemUserId();
  return ingestFeeds(
    userId,
    RSS_STATS_FEED_URLS.map((url) => ({ url, feedId: null, shareToStats: true })),
  );
}
