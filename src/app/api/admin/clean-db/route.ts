import { NextResponse } from "next/server";
import { z, ZodError } from "zod";
import { prisma } from "@/db/client";
import { requireAdmin } from "@/lib/FUNC-current-user";
import { verifyPassword } from "@/lib/FUNC-auth";
import { cleanDatasets, CLEAN_KEYS, type CleanKey } from "@/db/FUNC-cleanup-repo";
import { logger } from "@/lib/logger";

/**
 * POST /api/admin/clean-db — DESTRUCTIVE. Empties selected datasets so they can
 * be repopulated (e.g. from a g2 backfill).
 *
 * Defence in depth (this must never be exploitable):
 *  1. requireAdmin — valid JWT AND role re-checked in the DB (not just a claim).
 *  2. Re-auth — the acting admin's OWN password is verified server-side against
 *     their scrypt hash. A stolen/leaked JWT alone cannot trigger a wipe.
 *  3. Allowlist — only fixed dataset KEYS are accepted (zod enum); table names
 *     are code constants in FUNC-cleanup-repo, never client input. Account data
 *     (users/feeds/channels/auth) is not clearable here.
 *  4. Audited — every invocation is logged with the admin's id + email.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({
  datasets: z.array(z.enum(CLEAN_KEYS as [CleanKey, ...CleanKey[]])).min(1),
  password: z.string().min(1),
});

export async function POST(req: Request) {
  const auth = await requireAdmin(req);
  if ("response" in auth) return auth.response;

  try {
    const { datasets, password } = schema.parse(await req.json());

    // Re-authenticate the acting admin's OWN password (not just the JWT).
    const me = await prisma.user.findUnique({
      where: { id: auth.user.sub },
      select: { passwordHash: true, email: true, role: true },
    });
    if (me?.role !== "admin") {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }
    if (!me.passwordHash) {
      return NextResponse.json(
        { error: "set a password on your account before cleaning the database" },
        { status: 400 },
      );
    }
    if (!verifyPassword(password, me.passwordHash)) {
      logger.warn(`ADMIN CLEAN-DB denied (bad password): ${me.email} (${auth.user.sub})`);
      return NextResponse.json({ error: "incorrect password" }, { status: 403 });
    }

    logger.warn(`ADMIN CLEAN-DB: ${me.email} (${auth.user.sub}) clearing [${datasets.join(", ")}]`);
    const result = await cleanDatasets(datasets);
    logger.warn(`ADMIN CLEAN-DB done by ${me.email}: ${JSON.stringify(result.counts)}`);

    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: "invalid input", issues: error.issues }, { status: 400 });
    }
    logger.error("clean-db failed", error);
    return NextResponse.json(
      { error: "clean failed", message: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    );
  }
}
