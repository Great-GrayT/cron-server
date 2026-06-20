import axios from "axios";
import * as cheerio from "cheerio";
import ExcelJS from "exceljs";
import { logger } from "@/lib/logger";
import { ProgressEmitter } from "@/lib/FUNC-progress-emitter";

export interface LinkedInJob {
  id: string;
  title: string;
  company: string;
  location: string;
  searchCountry: string;
  currency: string;
  domain: string;
  postedDate: string;
  postedTimeAgo: string;
  description: string;
  url: string;
  inputKeyword: string;
  companyUrl?: string;
  img?: string;
  earlyApplicant?: boolean;
  compensation?: string;
  recruiterName?: string;
  recruiterRole?: string;
  detailedDescription?: string;
}

export interface ScrapeParams {
  searchText: string;
  locationText: string;
  timeFilter?: number; // in seconds
}

interface CountryConfig {
  domain: string;
  locationParam: string;
  currency: string;
  language: string;
}

const COUNTRY_CONFIGS: Record<string, CountryConfig> = {
  "United States": {
    domain: "linkedin.com",
    locationParam: "United States",
    currency: "USD",
    language: "en-US,en;q=0.9",
  },
  "United Kingdom": {
    domain: "linkedin.com",
    locationParam: "United Kingdom",
    currency: "GBP",
    language: "en-GB,en;q=0.9",
  },
  Ireland: {
    domain: "linkedin.com",
    locationParam: "Ireland",
    currency: "EUR",
    language: "en-IE,en;q=0.9",
  },
  Canada: {
    domain: "linkedin.com",
    locationParam: "Canada",
    currency: "CAD",
    language: "en-CA,en;q=0.9,fr-CA,fr;q=0.8",
  },
  Germany: {
    domain: "linkedin.com",
    locationParam: "Germany",
    currency: "EUR",
    language: "de-DE,de;q=0.9,en;q=0.8",
  },
  France: {
    domain: "linkedin.com",
    locationParam: "France",
    currency: "EUR",
    language: "fr-FR,fr;q=0.9,en;q=0.8",
  },
  Australia: {
    domain: "linkedin.com",
    locationParam: "Australia",
    currency: "AUD",
    language: "en-AU,en;q=0.9",
  },
  Netherlands: {
    domain: "linkedin.com",
    locationParam: "Netherlands",
    currency: "EUR",
    language: "nl-NL,nl;q=0.9,en;q=0.8",
  },
  Luxembourg: {
    domain: "linkedin.com",
    locationParam: "Luxembourg",
    currency: "EUR",
    language: "fr-LU,fr;q=0.9,de-LU,de;q=0.8,en;q=0.7",
  },
  Belgium: {
    domain: "linkedin.com",
    locationParam: "Belgium",
    currency: "EUR",
    language: "nl-BE,nl;q=0.9,fr-BE,fr;q=0.8,en;q=0.7",
  },
  Switzerland: {
    domain: "linkedin.com",
    locationParam: "Switzerland",
    currency: "CHF",
    language: "de-CH,de;q=0.9,fr-CH,fr;q=0.8,en;q=0.7",
  },
  Spain: {
    domain: "linkedin.com",
    locationParam: "Spain",
    currency: "EUR",
    language: "es-ES,es;q=0.9,en;q=0.8",
  },
  Italy: {
    domain: "linkedin.com",
    locationParam: "Italy",
    currency: "EUR",
    language: "it-IT,it;q=0.9,en;q=0.8",
  },
};

function buildJobSearchUrl(
  searchParams: ScrapeParams & { pageNumber: number },
  countryConfig?: CountryConfig
): string {
  const domain = countryConfig ? countryConfig.domain : "linkedin.com";
  const timeFilter = searchParams.timeFilter || 86400; // Default to 24 hours

  return `https://${domain}/jobs-guest/jobs/api/seeMoreJobPostings/search?keywords=${encodeURIComponent(
    searchParams.searchText
  )}&start=${searchParams.pageNumber * 25}${
    searchParams.locationText
      ? "&location=" + encodeURIComponent(searchParams.locationText)
      : ""
  }&f_TPR=r${timeFilter}`;
}

async function scrapeJobsFromHtml(html: string): Promise<LinkedInJob[]> {
  const $ = cheerio.load(html);
  const results: LinkedInJob[] = [];

  // LinkedIn job cards are typically in <li> elements
  $("li").each((i, element) => {
    try {
      const $item = $(element);

      // Check if this is a job card by looking for the title
      const titleElem = $item.find(".base-search-card__title");
      if (!titleElem.length) return;

      const title = titleElem.text().trim();
      const imgSrc = $item.find("img").attr("data-delayed-url") || "";

      // Try multiple selectors to find the job URL
      let url = "";
      const linkSelectors = [
        ".base-card__full-link",
        ".base-search-card--link",
        "a[href*='/jobs/view/']",
        "a.base-card__full-link",
        "a",
      ];

      for (const selector of linkSelectors) {
        const link = $item.find(selector).first().attr("href");
        if (link && link.includes("/jobs")) {
          url = link.trim();
          break;
        }
      }

      // If still no URL, try to find any anchor tag
      if (!url) {
        $item.find("a").each((_, anchor) => {
          const href = $(anchor).attr("href");
          if (href && (href.includes("/jobs") || href.includes("linkedin.com"))) {
            url = href.trim();
            return false; // Break the loop
          }
        });
      }

      const companyContainer = $item.find(".base-search-card__subtitle");
      const companyUrl = companyContainer.find("a").attr("href") || "";
      const companyName = companyContainer.text().trim();

      const companyLocation = $item.find(".job-search-card__location").text().trim();

      const dateTimeElem = $item.find(".job-search-card__listdate, .job-search-card__listdate--new");
      const dateTime = dateTimeElem.attr("datetime") || "";
      const postedTimeAgo = dateTimeElem.text().trim();

      const toDate = (dateString: string) => {
        const [year, month, day] = dateString.split("-");
        return new Date(
          parseFloat(year),
          parseFloat(month) - 1,
          parseFloat(day)
        );
      };

      const postedDate = dateTime ? toDate(dateTime).toISOString() : "";

      const description = $item.find(".job-search-card__snippet").text().trim();

      // Check for early applicant badge
      const earlyApplicantText = $item.find(".job-posting-benefits__text").text().toLowerCase();
      const earlyApplicant = earlyApplicantText.includes("early applicant");

      const entityUrn = $item.children().first().attr("data-entity-urn") || `job-${i}`;

      const result: LinkedInJob = {
        id: entityUrn,
        title,
        company: companyName,
        location: companyLocation,
        searchCountry: "",
        currency: "",
        domain: "",
        inputKeyword: "",
        postedDate,
        postedTimeAgo,
        description,
        url,
        companyUrl,
        img: imgSrc,
        earlyApplicant,
      };

      results.push(result);
    } catch (e) {
      logger.error(`Error retrieving linkedin page item: ${i}`, e);
    }
  });

  return results;
}

/**
 * Helper function to run promises with controlled concurrency
 */
async function runWithConcurrency<T>(
  tasks: (() => Promise<T>)[],
  concurrency: number
): Promise<T[]> {
  const results: T[] = [];
  const executing: Promise<void>[] = [];

  for (const task of tasks) {
    const promise = task().then((result) => {
      results.push(result);
      // Remove from executing array when done
      const index = executing.indexOf(promise);
      if (index > -1) executing.splice(index, 1);
    });

    executing.push(promise);

    if (executing.length >= concurrency) {
      await Promise.race(executing);
    }
  }

  await Promise.all(executing);
  return results;
}

/**
 * Scrapes a single page for a keyword/country combination
 */
async function scrapeSinglePage(
  keyword: string,
  country: string,
  countryConfig: CountryConfig | undefined,
  pageNumber: number,
  timeFilter: number | undefined
): Promise<LinkedInJob[]> {
  const url = buildJobSearchUrl(
    {
      searchText: keyword,
      locationText: countryConfig?.locationParam || country,
      timeFilter,
      pageNumber,
    },
    countryConfig
  );

  try {
    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": countryConfig?.language || "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate, br",
        Connection: "keep-alive",
        "Upgrade-Insecure-Requests": "1",
      },
      timeout: 30000,
    });

    const jobs = await scrapeJobsFromHtml(response.data);

    if (!jobs || jobs.length === 0) {
      return [];
    }

    // Add metadata
    const jobsWithMetadata = jobs.map((job: LinkedInJob) => ({
      ...job,
      searchCountry: country,
      currency: countryConfig?.currency || "USD",
      domain: countryConfig?.domain || "linkedin.com",
      inputKeyword: keyword,
    }));

    logger.info(`✓ Found ${jobs.length} jobs: ${keyword} in ${country} (page ${pageNumber + 1})`);
    return jobsWithMetadata;
  } catch (err) {
    logger.error(`✗ Error: ${keyword} in ${country} (page ${pageNumber + 1})`, err);
    return [];
  }
}

/**
 * Scrapes all pages for a single keyword/country combination
 */
async function scrapeKeywordCountry(
  keyword: string,
  country: string,
  countryConfig: CountryConfig | undefined,
  timeFilter: number | undefined,
  maxPages: number
): Promise<LinkedInJob[]> {
  const allJobsForCombo: LinkedInJob[] = [];

  // Scrape pages sequentially for each keyword/country combo to avoid overwhelming
  for (let page = 0; page < maxPages; page++) {
    const jobs = await scrapeSinglePage(keyword, country, countryConfig, page, timeFilter);

    if (jobs.length === 0) {
      // No jobs found, stop pagination for this combo
      break;
    }

    allJobsForCombo.push(...jobs);

    // Small delay between pages for the same combo
    if (page < maxPages - 1) {
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
  }

  return allJobsForCombo;
}

export async function scrapeLinkedInJobs(
  params: ScrapeParams,
  progressEmitter?: ProgressEmitter
): Promise<LinkedInJob[]> {
  const MAX_PAGES = 10;
  const CONCURRENCY = 20; // Number of concurrent keyword/country combinations
  let allJobs: LinkedInJob[] = [];

  // Parse search keywords (comma-separated)
  const searchKeywords = params.searchText
    .split(",")
    .map((keyword) => keyword.trim())
    .filter((keyword) => keyword.length > 0);

  const countries = params.locationText
    .split(",")
    .map((country) => country.trim())
    .filter((country) => country.length > 0);

  const totalCombinations = searchKeywords.length * countries.length;
  const logMessage = `Starting CONCURRENT LinkedIn scrape for ${searchKeywords.length} keywords across ${countries.length} countries (${totalCombinations} combinations, ${CONCURRENCY} at a time)`;
  logger.info(logMessage);
  progressEmitter?.progress('initialization', logMessage, 0, totalCombinations);

  try {
    // Create all keyword/country combination tasks
    const tasks: (() => Promise<LinkedInJob[]>)[] = [];

    for (const keyword of searchKeywords) {
      for (const country of countries) {
        const countryConfig = COUNTRY_CONFIGS[country];

        // Create a task for each keyword/country combination
        tasks.push(() =>
          scrapeKeywordCountry(
            keyword,
            country,
            countryConfig,
            params.timeFilter,
            MAX_PAGES
          )
        );
      }
    }

    logger.info(`Created ${tasks.length} scraping tasks to run with concurrency of ${CONCURRENCY}`);

    // Run all tasks with controlled concurrency
    const results = await runWithConcurrency(tasks, CONCURRENCY);

    // Flatten all results into allJobs
    for (const jobsFromCombo of results) {
      allJobs.push(...jobsFromCombo);
    }

    logger.info(`\n=== Concurrent Scraping Complete ===`);
    logger.info(`Total jobs scraped: ${allJobs.length}`);
  } catch (error) {
    logger.error("Error during scraping:", error);
    throw error;
  }

  // Remove duplicates based on job URL (using persistent cache)
  // Only consider URLs that contain "http" as valid
  const uniqueJobs: LinkedInJob[] = [];
  let invalidUrlCount = 0;
  let duplicateCount = 0;

  logger.info(`\n=== Starting In-Memory Deduplication ===`);
  logger.info(`Total jobs scraped this run: ${allJobs.length}`);

  const seenUrls = new Set<string>();

  for (const job of allJobs) {
    const normalizedUrl = job.url.toLowerCase().trim();

    // Skip jobs with invalid URLs (must contain http)
    if (!normalizedUrl.includes('http')) {
      invalidUrlCount++;
      logger.warn(`⚠ Skipping job with invalid URL: "${job.url}" - ${job.title}`);
      continue;
    }

    // Check if URL was already seen in this scrape session
    if (!seenUrls.has(normalizedUrl)) {
      seenUrls.add(normalizedUrl);
      uniqueJobs.push(job);
      logger.info(`✓ NEW job in this session: ${normalizedUrl}`);
    } else {
      duplicateCount++;
      logger.info(`✗ DUPLICATE in this session: ${normalizedUrl} - ${job.title}`);
    }
  }

  logger.info(`\n=== Deduplication Summary ===`);
  logger.info(`Jobs scraped this run: ${allJobs.length}`);
  logger.info(`Invalid URLs skipped: ${invalidUrlCount}`);
  logger.info(`Unique jobs in this session: ${uniqueJobs.length}`);
  logger.info(`Duplicates within this session: ${duplicateCount}`);

  const totalMessage = `Total jobs scraped this run: ${allJobs.length}`;
  const uniqueJobsMessage = `Unique jobs: ${uniqueJobs.length}`;
  const duplicateMessage = `Duplicates within session: ${duplicateCount}`;
  const invalidMessage = `Invalid URLs skipped: ${invalidUrlCount}`;

  progressEmitter?.progress('deduplication', totalMessage);
  progressEmitter?.progress('deduplication', uniqueJobsMessage);
  progressEmitter?.progress('deduplication', duplicateMessage);
  progressEmitter?.progress('deduplication', invalidMessage);

  progressEmitter?.complete(
    'complete',
    `Found ${uniqueJobs.length} unique jobs (${duplicateCount} duplicates, ${invalidUrlCount} invalid URLs)`,
    {
      totalScraped: allJobs.length,
      uniqueJobs: uniqueJobs.length,
      duplicates: duplicateCount,
      invalidUrls: invalidUrlCount,
    }
  );

  return uniqueJobs;
}

export async function createExcelFile(jobs: LinkedInJob[]): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Job Listings");

  // Define columns
  worksheet.columns = [
    { header: "Input Keyword", key: "inputKeyword", width: 20 },
    { header: "Title", key: "title", width: 30 },
    { header: "Company", key: "company", width: 25 },
    { header: "Location", key: "location", width: 20 },
    { header: "Country", key: "searchCountry", width: 15 },
    { header: "Currency", key: "currency", width: 10 },
    { header: "Posted Date", key: "postedDate", width: 15 },
    { header: "Posted Time Ago", key: "postedTimeAgo", width: 20 },
    { header: "Early Applicant", key: "earlyApplicant", width: 15 },
    { header: "Description", key: "description", width: 40 },
    { header: "URL", key: "url", width: 50 },
    { header: "Company URL", key: "companyUrl", width: 50 },
  ];

  // Add data rows
  jobs.forEach((job) => {
    worksheet.addRow({
      inputKeyword: job.inputKeyword,
      title: job.title,
      company: job.company,
      location: job.location,
      searchCountry: job.searchCountry,
      currency: job.currency,
      postedDate: job.postedDate ? new Date(job.postedDate).toLocaleDateString("en-GB") : "",
      postedTimeAgo: job.postedTimeAgo,
      earlyApplicant: job.earlyApplicant ? "Yes" : "No",
      description: job.description,
      url: job.url,
      companyUrl: job.companyUrl || "",
    });
  });

  // Style the header row
  const headerRow = worksheet.getRow(1);
  headerRow.font = { bold: true, size: 11, color: { argb: "FFFFFFFF" } };
  headerRow.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF4A90E2" },
  };

  // Auto-filter
  worksheet.autoFilter = "A1:L1";

  // Generate buffer
  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}
