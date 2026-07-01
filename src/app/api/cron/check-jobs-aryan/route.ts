import { NextRequest, NextResponse } from "next/server";
import { checkAndSendJobs, type JobMonitorConfig } from "@/core/workers/job-monitor";
import { verifyCronRequest, ValidationError } from "@/lib/validation";
import { logger } from "@/lib/logger";
import {
  RSS_ARYAN_FEED_URLS,
  TELEGRAM_ARYAN_BOT_TOKEN,
  TELEGRAM_ARYAN_CHAT_ID,
  GOAT_TELEGRAM_ARYAN_BOT_TOKEN,
  GOAT_TELEGRAM_ARYAN_CHAT_ID,
} from "@/config/constants";

/**
 * GET /api/cron/check-jobs-aryan
 *
 * Aryan variant: checks RSS_ARYAN_FEED_URLS and notifies the Aryan + GOAT-Aryan
 * Telegram bots. Same filtering pipeline as the main cron, GOAT gates relaxed.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!verifyCronRequest(authHeader)) {
    logger.warn("Unauthorized aryan cron request attempt");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    if (!TELEGRAM_ARYAN_BOT_TOKEN) throw new ValidationError("TELEGRAM_ARYAN_BOT_TOKEN is not set");
    if (!TELEGRAM_ARYAN_CHAT_ID) throw new ValidationError("TELEGRAM_ARYAN_CHAT_ID is not set");
    if (RSS_ARYAN_FEED_URLS.length === 0) throw new ValidationError("RSS_ARYAN_FEED_URLS is not set or empty");

    const config: JobMonitorConfig = {
      feedUrls: RSS_ARYAN_FEED_URLS,
      mainBotToken: TELEGRAM_ARYAN_BOT_TOKEN,
      mainChatId: TELEGRAM_ARYAN_CHAT_ID,
      filteredBotToken: GOAT_TELEGRAM_ARYAN_BOT_TOKEN,
      filteredChatId: GOAT_TELEGRAM_ARYAN_CHAT_ID,
      cacheKey: "url-rss-aryan",
      label: "aryan",
      appliedNamespace: "aryan",
      // Legacy env pipeline: no JFS sets.
      filterSets: [],
    };

    logger.info("Aryan cron job started");
    const result = await checkAndSendJobs(config);
    logger.info("Aryan cron job completed successfully", result);

    return NextResponse.json({ success: true, timestamp: new Date().toISOString(), ...result });
  } catch (error) {
    logger.error("Aryan cron job error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const errorName = error instanceof Error ? error.name : "Error";
    return NextResponse.json(
      { error: errorMessage, errorType: errorName, timestamp: new Date().toISOString() },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  return GET(request);
}
