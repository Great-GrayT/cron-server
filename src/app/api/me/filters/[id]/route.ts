import { NextResponse } from "next/server";
import { z, ZodError } from "zod";
import { prisma } from "@/db/client";
import { requireUser } from "@/lib/FUNC-current-user";
import { conditionSchema } from "@/lib/FUNC-filter-schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const patchSchema = z.object({
  name: z.string().min(1).max(120).optional(),
  enabled: z.boolean().optional(), // toggle to pause/resume a set
  conditions: z.array(conditionSchema).min(1).max(30).optional(),
});

/** PATCH /api/me/filters/{id} — rename, pause/resume, or replace conditions. */
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireUser(req);
  if ("response" in auth) return auth.response;
  const { id } = await params;
  try {
    const { name, enabled, conditions } = patchSchema.parse(await req.json());

    const owned = await prisma.filterSet.findFirst({ where: { id, userId: auth.user.sub }, select: { id: true } });
    if (!owned) return NextResponse.json({ error: "filter set not found" }, { status: 404 });

    const filterSet = await prisma.$transaction(async (tx) => {
      await tx.filterSet.update({
        where: { id },
        data: { ...(name !== undefined && { name }), ...(enabled !== undefined && { enabled }) },
      });
      if (conditions) {
        await tx.filterCondition.deleteMany({ where: { filterSetId: id } });
        await tx.filterCondition.createMany({
          data: conditions.map((c, i) => ({ filterSetId: id, ...c, position: i })),
        });
      }
      return tx.filterSet.findUnique({ where: { id }, include: { conditions: { orderBy: { position: "asc" } } } });
    });

    return NextResponse.json({ filterSet });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: "invalid input", issues: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "failed to update filter set" }, { status: 500 });
  }
}

/** DELETE /api/me/filters/{id} */
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireUser(req);
  if ("response" in auth) return auth.response;
  const { id } = await params;
  const result = await prisma.filterSet.deleteMany({ where: { id, userId: auth.user.sub } });
  if (result.count === 0) return NextResponse.json({ error: "filter set not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
