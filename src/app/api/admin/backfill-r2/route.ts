import { NextResponse } from "next/server";
import { z, ZodError } from "zod";
import { requireAdmin } from "@/lib/FUNC-current-user";
import { runBackfillJob } from "@/core/workers/backfill-r2";
import { envR2Credentials, type R2Credentials } from "@/services/r2/FUNC-r2-reader";
import {
  createBackfillJob,
  findRunningBackfill,
  getBackfillJob,
} from "@/db/FUNC-backfill-repo";
import { logger } from "@/lib/logger";

/**
 * Admin-only g2 import from the old R2 store.
 *
 * POST — start an async import. Auth: Bearer JWT of an **admin** (re-checked in
 * the DB). R2 credentials come from the body (frontend host forwards them; used
 * transiently, never stored) or the server env. Creates a BackfillJob row,
 * launches the streaming worker DETACHED, and returns `{ jobId }` immediately so
 * no long request is held open (that was the 502 cause). Rejects if one is
 * already running.
 *
 * GET ?jobId=... — poll the progress row (status, counters, log tail).
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const credsSchema = z.object({
  accountId: z.string().min(1),
  accessKeyId: z.string().min(1),
  secretAccessKey: z.string().min(1),
  bucket: z.string().min(1),
});

export async function POST(req: Request) {
  const auth = await requireAdmin(req);
  if ("response" in auth) return auth.response;

  try {
    const body = await req.json().catch(() => ({}));
    let creds: R2Credentials | null = envR2Credentials();
    if (body && typeof body === "object" && body.accountId) {
      creds = credsSchema.parse(body);
    }
    if (!creds) {
      return NextResponse.json(
        { error: "R2 credentials required (in body: accountId, accessKeyId, secretAccessKey, bucket)" },
        { status: 400 },
      );
    }

    // Single-run guard: don't let two imports fight over the same rows.
    const running = await findRunningBackfill();
    if (running) {
      return NextResponse.json(
        { error: "a backfill is already running", jobId: running.id, status: running.status },
        { status: 409 },
      );
    }

    const jobId = await createBackfillJob(auth.user.sub);

    // Launch detached — the server is a long-lived process (docker `node
    // server.js`), so this survives the response. Do NOT await it.
    void runBackfillJob(jobId, creds, auth.user.sub).catch((e) =>
      logger.error("backfill worker crashed", e),
    );

    return NextResponse.json({ success: true, jobId, status: "running" }, { status: 202 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: "invalid R2 credentials", issues: error.issues }, { status: 400 });
    }
    logger.error("backfill-r2 start failed", error);
    return NextResponse.json(
      { error: "backfill start failed", message: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    );
  }
}

export async function GET(req: Request) {
  const auth = await requireAdmin(req);
  if ("response" in auth) return auth.response;

  const jobId = new URL(req.url).searchParams.get("jobId");
  const job = jobId ? await getBackfillJob(jobId) : await findRunningBackfill();
  if (!job) return NextResponse.json({ error: "no backfill found", status: "idle" }, { status: 404 });

  return NextResponse.json({
    jobId: job.id,
    status: job.status,
    phase: job.phase,
    monthsDone: job.monthsDone,
    daysDone: job.daysDone,
    read: job.read,
    inserted: job.inserted,
    logs: job.logs,
    error: job.error,
    startedAt: job.startedAt,
    finishedAt: job.finishedAt,
  });
}
