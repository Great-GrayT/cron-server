import { NextRequest, NextResponse } from "next/server";
import { validateTrackingUrl, decodeJobData } from "@/lib/FUNC-tracking-url";
import { recordApplied } from "@/db/FUNC-applied-repo";
import { logger } from "@/lib/logger";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BOT_PATTERNS = [
  "telegrambot", "telegram", "whatsapp", "slackbot", "discordbot",
  "facebookexternalhit", "twitterbot", "linkedinbot", "bot", "crawler",
  "spider", "preview",
];

function isBotRequest(userAgent: string | null): boolean {
  if (!userAgent) return false;
  const ua = userAgent.toLowerCase();
  return BOT_PATTERNS.some((p) => ua.includes(p));
}

/**
 * GET /api/track
 *
 * Tracking link target. When a user clicks "Apply here" in their Telegram:
 *   1. validate the HMAC signature
 *   2. decode the embedded job data
 *   3. record the application into that user's applied store (namespace = userId;
 *      bot/link-preview hits are skipped)
 *   4. redirect to the real job URL
 *
 * The namespace (`n`) carries the owning user's id. Legacy links with no `n`
 * (or `n=default`) still redirect, but have no user to record against.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const userAgent = request.headers.get("user-agent");

  const jobId = searchParams.get("j");
  const timestamp = searchParams.get("t");
  const signature = searchParams.get("s");
  const encodedData = searchParams.get("d");
  const namespace = searchParams.get("n") || "default";

  if (!jobId || !timestamp || !signature || !encodedData) {
    return NextResponse.json({ error: "Invalid tracking URL - missing parameters" }, { status: 400 });
  }

  const validation = validateTrackingUrl(jobId, timestamp, signature, namespace);
  if (!validation.valid) {
    logger.warn(`Track: invalid signature - ${validation.error}`);
    return NextResponse.json({ error: validation.error || "Invalid tracking URL" }, { status: 403 });
  }

  const jobData = decodeJobData(encodedData);
  if (!jobData) {
    return NextResponse.json({ error: "Invalid tracking URL - corrupted data" }, { status: 400 });
  }

  // Bot/link-preview: just redirect, never record.
  if (isBotRequest(userAgent)) {
    return NextResponse.redirect(jobData.jobUrl, 302);
  }

  // Record only when the namespace is a real user id (not the legacy default).
  if (namespace && namespace !== "default") {
    try {
      await recordApplied(namespace, jobData);
      logger.info(`Track [${namespace}]: logged "${jobData.title}" @ "${jobData.company}"`);
    } catch (error) {
      // Never block the redirect on a logging failure.
      logger.error("Track: failed to record application", error);
    }
  }

  return NextResponse.redirect(jobData.jobUrl, 302);
}
