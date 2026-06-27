import { NextResponse } from "next/server";
import { prisma } from "@/db/client";
import { requireUser } from "@/lib/FUNC-current-user";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** GET /api/me/schedules/{id}/runs — recent run history for this schedule. */
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireUser(req);
  if ("response" in auth) return auth.response;
  const { id } = await params;

  // Ensure the schedule belongs to the user.
  const sched = await prisma.schedule.findFirst({ where: { id, userId: auth.user.sub }, select: { id: true } });
  if (!sched) return NextResponse.json({ error: "schedule not found" }, { status: 404 });

  const runs = await prisma.scheduleRun.findMany({
    where: { scheduleId: id },
    orderBy: { createdAt: "desc" },
    take: 20,
  });
  return NextResponse.json({ runs });
}
