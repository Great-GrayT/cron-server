import { logger } from "@/lib/logger";
import {
  runDueSchedules,
  purgeUnverifiedUsers,
  pruneRunHistory,
  pruneOldDescriptions,
} from "@/core/workers/run-user";
import { failOrphanedBackfills } from "@/db/FUNC-backfill-repo";

/**
 * In-process cron scheduler. The server drives its own schedules — no external
 * caller. A timer fires every TICK_MS and runs whichever user schedules are due
 * (per their intervalMinutes / cronExpr). Housekeeping (purge/prune) runs hourly.
 *
 * TICK_MS is sub-minute on purpose: cronExpr matching has minute granularity, so
 * ticking every 30s guarantees every wall-clock minute gets at least one tick and
 * no `* * * * *`-style schedule is ever skipped by timer drift. Re-firing within
 * the same minute is harmless — runDueSchedules() dedups via lastRunAt (>= 60s).
 */
const TICK_MS = 30_000;
const HOUSEKEEPING_MS = 60 * 60_000;

let started = false;
let ticking = false;
let lastHousekeeping = 0;

async function tick(): Promise<void> {
  // Never overlap: a slow tick (many users due, network I/O) must finish before
  // the next starts, or runs pile up and hammer the DB / Telegram.
  if (ticking) return;
  ticking = true;
  try {
    const { ran } = await runDueSchedules();
    if (ran > 0) logger.info(`scheduler: ran ${ran} due schedule(s)`);

    if (Date.now() - lastHousekeeping >= HOUSEKEEPING_MS) {
      lastHousekeeping = Date.now();
      await purgeUnverifiedUsers().catch(() => 0);
      await pruneRunHistory().catch(() => ({ scheduleRuns: 0, cronRuns: 0 }));
      await pruneOldDescriptions().catch(() => 0);
    }
  } catch (err) {
    logger.error("scheduler tick failed", err);
  } finally {
    ticking = false;
  }
}

/**
 * Start the scheduler. Idempotent — safe to call once per process. Kicks an
 * immediate tick so a restart doesn't idle for a full interval, then repeats.
 */
export function startScheduler(): void {
  if (started) return;
  started = true;
  logger.info(`scheduler started (tick every ${TICK_MS}ms)`);
  // A backfill still marked "running" at boot lost its worker to a crash/restart
  // — fail it so the admin page stops polling a job that can never finish.
  void failOrphanedBackfills()
    .then((n) => n > 0 && logger.info(`marked ${n} orphaned backfill(s) as failed`))
    .catch((e) => logger.error("failOrphanedBackfills failed", e));
  void tick();
  const timer = setInterval(() => void tick(), TICK_MS);
  // Let the process exit cleanly on shutdown — the HTTP server keeps the event
  // loop alive, this timer shouldn't block it.
  timer.unref?.();
}
