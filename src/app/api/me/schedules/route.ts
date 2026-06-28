import { NextResponse } from "next/server";
import { z, ZodError } from "zod";
import { prisma } from "@/db/client";
import { requireUser } from "@/lib/FUNC-current-user";
import { isValidCron } from "@/lib/FUNC-cron";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const cronField = z
  .string()
  .max(120)
  .nullable()
  .optional()
  .refine((v) => !v || isValidCron(v), { message: "invalid 5-field cron expression" });

const upsertSchema = z.object({
  job: z.enum(["check-jobs", "stats-ingest", "scrape"]),
  intervalMinutes: z.coerce.number().int().min(5).max(10080).default(60),
  cronExpr: cronField,
  enabled: z.boolean().default(true),
  scrapeSearch: z.string().max(500).nullable().optional(),
  scrapeCountries: z.string().max(500).nullable().optional(),
  scrapeTimeFilter: z.coerce.number().int().min(60).max(2592000).nullable().optional(),
});

/** GET /api/me/schedules — the user's per-pipeline schedules. */
export async function GET(req: Request) {
  const auth = requireUser(req);
  if ("response" in auth) return auth.response;
  const schedules = await prisma.schedule.findMany({ where: { userId: auth.user.sub }, orderBy: { job: "asc" } });
  return NextResponse.json({ schedules });
}

/** POST /api/me/schedules — create/replace a schedule for one pipeline. */
export async function POST(req: Request) {
  const auth = requireUser(req);
  if ("response" in auth) return auth.response;
  try {
    const { job, ...rest } = upsertSchema.parse(await req.json());
    const schedule = await prisma.schedule.upsert({
      where: { userId_job: { userId: auth.user.sub, job } },
      create: { userId: auth.user.sub, job, ...rest },
      update: rest,
    });
    return NextResponse.json({ schedule }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: "invalid input", issues: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "failed to save schedule" }, { status: 500 });
  }
}
