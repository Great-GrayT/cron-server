import { parseRSSFeeds } from "@/services/rss/FUNC-rss-parser";
import { JobMetadataExtractor } from "@/analysis/FUNC-job-metadata-extractor";
import { SalaryExtractor } from "@/analysis/FUNC-salary-extractor";
import { LocationExtractor } from "@/analysis/FUNC-location-extractor";
import { extractJobDetails, analyzeJobDescription } from "@/analysis/FUNC-job-analyzer";
import { RoleTypeExtractor } from "@/analysis/FUNC-role-type-extractor";
import { softwareKeywords } from "@/analysis/dictionaries/software";
import { programmingKeywords } from "@/analysis/dictionaries/programming-languages";
import { findExistingUrls, insertJobs } from "@/db/FUNC-jobs-repo";
import { RSS_STATS_FEED_URLS } from "@/config/constants";
import { logger } from "@/lib/logger";
import type { JobRegion, JobStatistic } from "@/types/stats";

export interface StatsIngestResult {
  processed: number;
  newJobs: number;
  skippedKnown: number;
}

/**
 * Stats ingestion pipeline (was the inline loop in /api/stats/get).
 *
 * Fetches the stats RSS feeds, runs the full analysis pipeline on each
 * not-yet-seen job, and persists the results to Postgres. Dedup is a single
 * batched `findExistingUrls` query (replacing the R2 url-index), and the
 * heavy extractor pipeline is skipped for URLs we already have.
 */
export async function ingestStatsFromRss(): Promise<StatsIngestResult> {
  logger.info(`Parsing ${RSS_STATS_FEED_URLS.length} stats RSS feeds...`);
  const allJobs = await parseRSSFeeds(RSS_STATS_FEED_URLS);
  logger.info(`Fetched ${allJobs.length} total jobs from stats feeds`);

  // Keep only jobs with a usable http(s) URL.
  const candidates = allJobs.filter((j) => j.link && j.link.includes("http"));

  // Dedup-first: one indexed query tells us which URLs we already store, so the
  // 95%+ of RSS items that repeat each tick skip the regex-heavy extractors.
  const existing = await findExistingUrls(candidates.map((j) => j.link));

  const newJobs: JobStatistic[] = [];
  let processed = 0;
  let skippedKnown = 0;

  for (const rssJob of candidates) {
    processed++;
    if (existing.has(rssJob.link)) {
      skippedKnown++;
      continue;
    }

    try {
      const jobDetails = extractJobDetails(rssJob.title);
      const finalCompany =
        jobDetails.company !== "N/A" ? jobDetails.company : rssJob.company || "Unknown Company";
      const finalPosition = jobDetails.position;
      const extractedLocation = jobDetails.location !== "N/A" ? jobDetails.location : null;

      // Location: prefer the title-extracted location, else derive from all fields.
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

      // Parse to a number and discard unrealistic values (>15 years).
      let experienceYears: number | null = null;
      if (analysis.yearsExperience) {
        const yearsMatch = analysis.yearsExperience.match(/(\d+)/);
        if (yearsMatch) {
          const years = parseInt(yearsMatch[1], 10);
          if (years >= 0 && years <= 15) experienceYears = years;
        }
      }

      const roleTypeMatch = RoleTypeExtractor.extractRoleType(
        finalPosition,
        metadata.keywords,
        description,
        metadata.industry,
      );

      newJobs.push({
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
      });
    } catch (error) {
      logger.error(`Error processing job: ${rssJob.title}`, error);
    }
  }

  const inserted = await insertJobs(newJobs);
  logger.info(`Stats ingest: processed ${processed}, inserted ${inserted}, skipped ${skippedKnown}`);

  return { processed, newJobs: inserted, skippedKnown };
}
