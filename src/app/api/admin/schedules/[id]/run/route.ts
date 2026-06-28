import { NextResponse } from "next/server";
import { prisma } from "@/db/client";
import { requireAdmin } from "@/lib/FUNC-current-user";
import { runScheduleNow } from "@/core/workers/run-user";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;

/** POST /api/admin/schedules/{id}/run — run any user's schedule now. */
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(req);
  if ("response" in auth) return auth.response;
  const { id } = await params;
  const sched = await prisma.schedule.findUnique({ where: { id }, select: { userId: true } });
  if (!sched) return NextResponse.json({ error: "schedule not found" }, { status: 404 });
  const result = await runScheduleNow(sched.userId, id, "manual");
  return NextResponse.json(result, { status: result.ok ? 200 : 422 });
}
