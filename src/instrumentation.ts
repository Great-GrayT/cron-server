/**
 * Next.js instrumentation hook — runs once when the server process boots
 * (`node server.js`). Starts the in-process cron scheduler so the server drives
 * its own user schedules with no external trigger.
 *
 * Node runtime only (skip Edge). In production it always runs; elsewhere it
 * requires SCHEDULER_ENABLED=1 so a local `next dev` doesn't fire real
 * Telegram/RSS jobs on every code reload.
 */
export async function register(): Promise<void> {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  const enabled =
    process.env.NODE_ENV === "production" || process.env.SCHEDULER_ENABLED === "1";
  if (!enabled) return;

  const { startScheduler } = await import("@/core/workers/scheduler");
  startScheduler();
}
