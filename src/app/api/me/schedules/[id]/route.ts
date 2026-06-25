import { NextResponse } from "next/server";
import { z, ZodError } from "zod";
import { prisma } from "@/db/client";
import { requireUser } from "@/lib/FUNC-current-user";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const patchSchema = z.object({
  intervalMinutes: z.coerce.number().int().min(5).max(10080).optional(),
  enabled: z.boolean().optional(),
  scrapeSearch: z.string().max(500).nullable().optional(),
  scrapeCountries: z.string().max(500).nullable().optional(),
  scrapeTimeFilter: z.coerce.number().int().min(60).max(2592000).nullable().optional(),
});

/** PATCH /api/me/schedules/{id} */
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireUser(req);
  if ("response" in auth) return auth.response;
  const { id } = await params;
  try {
    const data = patchSchema.parse(await req.json());
    const result = await prisma.schedule.updateMany({ where: { id, userId: auth.user.sub }, data });
    if (result.count === 0) return NextResponse.json({ error: "schedule not found" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: "invalid input", issues: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "failed to update schedule" }, { status: 500 });
  }
}

/** DELETE /api/me/schedules/{id} */
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireUser(req);
  if ("response" in auth) return auth.response;
  const { id } = await params;
  const result = await prisma.schedule.deleteMany({ where: { id, userId: auth.user.sub } });
  if (result.count === 0) return NextResponse.json({ error: "schedule not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
