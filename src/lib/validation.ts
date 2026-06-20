import { timingSafeEqual } from "node:crypto";
import { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, CRON_SECRET } from "@/config/constants";

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export function validateEnvironmentVariables(): void {
  if (!TELEGRAM_BOT_TOKEN) {
    throw new ValidationError("TELEGRAM_BOT_TOKEN is not set in environment variables");
  }
  if (!TELEGRAM_CHAT_ID) {
    throw new ValidationError("TELEGRAM_CHAT_ID is not set in environment variables");
  }
}

/**
 * Verify a cron request's bearer token.
 *
 * Security: when CRON_SECRET is set we compare in constant time to avoid
 * leaking the secret via timing. If CRON_SECRET is unset we fail OPEN only in
 * development; in production an unset secret denies the request (fail closed).
 */
export function verifyCronRequest(authHeader: string | null): boolean {
  if (!CRON_SECRET) {
    return process.env.NODE_ENV !== "production";
  }
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : "";
  const a = Buffer.from(token);
  const b = Buffer.from(CRON_SECRET);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
