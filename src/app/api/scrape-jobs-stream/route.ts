import { NextRequest } from "next/server";
import { scrapeLinkedInJobs, createExcelFile } from "@/services/scraper/FUNC-linkedin-scraper";
import { sendTelegramFile, sendTelegramMessage } from "@/services/telegram/FUNC-telegram";
import { logger } from "@/lib/logger";
import { validateEnvironmentVariables } from "@/lib/validation";
import { ProgressEmitter } from "@/lib/FUNC-progress-emitter";
import { SentUrlCache } from "@/db/FUNC-dedup-repo";

export const runtime = "nodejs";
export const maxDuration = 300; // 5 min ceiling for the scrape
export const dynamic = "force-dynamic";

/**
 * GET /api/scrape-jobs-stream  (Server-Sent Events)
 *
 * Scrapes LinkedIn for the given keywords/countries, dedups against the
 * Postgres ledger, builds an Excel file of NEW jobs, and ships it to Telegram —
 * streaming progress logs to the client throughout.
 * Example: ?search=CFA,CIMA&countries=United+Kingdom,Ireland&timeFilter=3600
 */
export async function GET(request: NextRequest) {
  const encoder = new TextEncoder();
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();

  const sendEvent = async (event: string, data: unknown) => {
    await writer.write(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
  };

  (async () => {
    try {
      await sendEvent("log", { message: "LinkedIn job scraping started", timestamp: new Date().toISOString() });
      validateEnvironmentVariables();

      const searchParams = request.nextUrl.searchParams;
      const searchText = searchParams.get("search") || searchParams.get("searchText") || "";
      const locationText = searchParams.get("countries") || searchParams.get("locationText") || "";
      const timeFilter = parseInt(searchParams.get("timeFilter") || "604800", 10);

      if (!searchText || !locationText) {
        await sendEvent("error", { message: "search and countries parameters are required" });
        await writer.close();
        return;
      }

      await sendEvent("log", {
        message: `Scraping jobs for: "${searchText}" in "${locationText}"`,
        timestamp: new Date().toISOString(),
      });

      const progressEmitter = new ProgressEmitter();
      progressEmitter.subscribe((update) => {
        void sendEvent("log", {
          message: update.message,
          timestamp: new Date().toISOString(),
          stage: update.stage,
          percentage: update.percentage,
        });
      });

      const jobs = await scrapeLinkedInJobs({ searchText, locationText, timeFilter }, progressEmitter);

      if (jobs.length === 0) {
        await sendEvent("log", { message: "No jobs found", timestamp: new Date().toISOString() });
        await sendTelegramMessage(
          `🔍 LinkedIn Job Scrape Complete\n\nSearch: "${searchText}"\nLocations: ${locationText}\n\nℹ️ No jobs found matching the criteria.`,
        );
        await sendEvent("complete", { success: true, message: "No jobs found", jobCount: 0 });
        await writer.close();
        return;
      }

      // Dedup against the Postgres ledger (replaces the R2 UrlCache).
      await sendEvent("log", { message: "🗄️  Loading dedup ledger...", timestamp: new Date().toISOString() });
      const urlCache = new SentUrlCache("url-scraper");
      await urlCache.load();

      await sendEvent("log", { message: `📊 Total scraped jobs: ${jobs.length}`, timestamp: new Date().toISOString() });
      await sendEvent("log", { message: `💾 URLs already in ledger: ${urlCache.size()}`, timestamp: new Date().toISOString() });

      const newJobs = jobs.filter((job) => !urlCache.has(job.url));

      await sendEvent("log", {
        message: `✨ Jobs after dedup: ${newJobs.length} NEW (filtered ${jobs.length - newJobs.length})`,
        timestamp: new Date().toISOString(),
      });

      if (newJobs.length === 0) {
        await sendEvent("log", { message: "⚠️  All jobs already processed", timestamp: new Date().toISOString() });
        await sendTelegramMessage(
          `🔍 LinkedIn Job Scrape Complete\n\nSearch: "${searchText}"\nLocations: ${locationText}\n\nℹ️ All ${jobs.length} jobs were already processed in previous runs.`,
        );
        await sendEvent("complete", {
          success: true,
          message: "No new jobs to send (all already cached)",
          jobCount: 0,
          totalScraped: jobs.length,
          alreadyCached: jobs.length,
        });
        await writer.close();
        return;
      }

      await sendEvent("log", { message: `📝 Creating Excel with ${newJobs.length} NEW jobs...`, timestamp: new Date().toISOString() });
      const excelBuffer = await createExcelFile(newJobs);

      // Record URLs before sending so a Telegram retry can't double-notify.
      for (const job of newJobs) urlCache.add(job.url, job.postedDate || undefined);
      await urlCache.save();
      await sendEvent("log", { message: `✓ Ledger saved (${urlCache.size()} URLs)`, timestamp: new Date().toISOString() });

      const timestamp = new Date().toISOString().split("T")[0];
      const countries = [...new Set(newJobs.map((job) => job.searchCountry))];
      const keywords = [...new Set(newJobs.map((job) => job.inputKeyword))];
      const filename = `linkedin_jobs_${newJobs.length}_${keywords.length}keywords_${countries.length}countries_${timestamp}.xlsx`;

      await sendEvent("log", { message: `📤 Sending Excel to Telegram (${newJobs.length} jobs)...`, timestamp: new Date().toISOString() });
      const caption = `📊 LinkedIn Job Scrape Complete\n\nKeywords: ${keywords.join(", ")}\nLocations: ${locationText}\n\n✅ Found ${newJobs.length} NEW jobs (${jobs.length - newJobs.length} already cached) across ${countries.length} countries:\n${countries.map((c) => `  • ${c}: ${newJobs.filter((j) => j.searchCountry === c).length} jobs`).join("\n")}`;

      await sendTelegramFile(excelBuffer, filename, caption);
      await sendEvent("log", { message: "✓ LinkedIn job scraping completed successfully", timestamp: new Date().toISOString() });

      await sendEvent("complete", {
        success: true,
        message: "Jobs scraped and sent to Telegram",
        jobCount: newJobs.length,
        totalScraped: jobs.length,
        alreadyCached: jobs.length - newJobs.length,
        keywords,
        countries,
        filename,
      });
      await writer.close();
    } catch (error) {
      logger.error("Error during LinkedIn scraping:", error);
      await sendEvent("error", { message: error instanceof Error ? error.message : String(error) });
      try {
        await sendTelegramMessage(
          `❌ LinkedIn Job Scrape Failed\n\nError: ${error instanceof Error ? error.message : String(error)}`,
        );
      } catch (telegramError) {
        logger.error("Failed to send error notification to Telegram:", telegramError);
      }
      await writer.close();
    }
  })();

  return new Response(stream.readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
