import { Prisma } from "@prisma/client";
import { prisma } from "@/db/client";

/**
 * Persistence for the async R2 backfill's progress record. The admin route
 * creates one, launches the import detached, and returns its id; the browser
 * polls it. Keeping state in a row (not memory) means progress survives the
 * request that started it and can be re-attached after a page reload.
 */

export interface BackfillLog {
  level: "info" | "success" | "error" | "warning";
  message: string;
  ts: string;
}

export interface BackfillProgress {
  monthsDone?: number;
  daysDone?: number;
  read?: number;
  inserted?: number;
  phase?: string;
}

const LOG_TAIL = 250; // keep only the most recent lines in the row

export async function createBackfillJob(ownerId: string): Promise<string> {
  const row = await prisma.backfillJob.create({
    data: { ownerId, status: "running", phase: "starting" },
    select: { id: true },
  });
  return row.id;
}

/** The most recent still-running job, if any (single-run guard + re-attach). */
export async function findRunningBackfill() {
  return prisma.backfillJob.findFirst({
    where: { status: "running" },
    orderBy: { startedAt: "desc" },
  });
}

export async function getBackfillJob(id: string) {
  return prisma.backfillJob.findUnique({ where: { id } });
}

/** Update counters/phase and append log lines (kept to a bounded tail). */
export async function updateBackfillJob(
  id: string,
  progress: BackfillProgress,
  newLogs: BackfillLog[] = [],
): Promise<void> {
  const data: Prisma.BackfillJobUpdateInput = { ...progress };
  if (newLogs.length) {
    const current = await prisma.backfillJob.findUnique({ where: { id }, select: { logs: true } });
    const existing = Array.isArray(current?.logs) ? (current!.logs as unknown as BackfillLog[]) : [];
    const merged = [...existing, ...newLogs];
    data.logs = merged.slice(-LOG_TAIL) as unknown as Prisma.InputJsonValue;
  }
  await prisma.backfillJob.update({ where: { id }, data });
}

export async function finishBackfillJob(
  id: string,
  status: "done" | "failed",
  error?: string,
  finalLog?: BackfillLog,
): Promise<void> {
  const current = await prisma.backfillJob.findUnique({ where: { id }, select: { logs: true } });
  const existing = Array.isArray(current?.logs) ? (current!.logs as unknown as BackfillLog[]) : [];
  const logs = finalLog ? [...existing, finalLog].slice(-LOG_TAIL) : existing;
  await prisma.backfillJob.update({
    where: { id },
    data: {
      status,
      error: error ?? null,
      phase: status === "done" ? "complete" : "failed",
      finishedAt: new Date(),
      logs: logs as unknown as Prisma.InputJsonValue,
    },
  });
}
