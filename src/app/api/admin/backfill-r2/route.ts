import { NextResponse } from "next/server";
import { z, ZodError } from "zod";
import { requireAdmin } from "@/lib/FUNC-current-user";
import { backfillFromR2 } from "@/core/workers/backfill-r2";
import { envR2Credentials, type R2Credentials } from "@/services/r2/FUNC-r2-reader";
import { logger } from "@/lib/logger";

/**
 * POST /api/admin/backfill-r2  (g2 import — admin only)
 *
 * Triggered from the admin page. Auth: Bearer JWT of an **admin** user (role
 * re-checked in the DB). The frontend host forwards the R2 credentials in the
 * body (they are used transiently, never stored); falls back to server R2_* env
 * if absent. Imported jobs are owned by the admin who triggered it.
 * Idempotent — re-running skips jobs already imported.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

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
    // Credentials come from the request body (admin page forwards them) or,
    // as a fallback, the server env.
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

    const result = await backfillFromR2(creds, auth.user.sub);
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: "invalid R2 credentials", issues: error.issues }, { status: 400 });
    }
    logger.error("backfill-r2 failed", error);
    return NextResponse.json(
      { error: "backfill failed", message: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    );
  }
}
