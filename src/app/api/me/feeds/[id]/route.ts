import { NextResponse } from "next/server";
import { z, ZodError } from "zod";
import { prisma } from "@/db/client";
import { requireUser } from "@/lib/FUNC-current-user";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const patchSchema = z.object({
  name: z.string().max(120).nullable().optional(),
  notify: z.boolean().optional(),
  shareToStats: z.boolean().optional(),
  active: z.boolean().optional(),
});

/** PATCH /api/me/feeds/{id} — update a feed (ownership enforced). */
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireUser(req);
  if ("response" in auth) return auth.response;
  const { id } = await params;
  try {
    const data = patchSchema.parse(await req.json());
    const result = await prisma.feed.updateMany({ where: { id, userId: auth.user.sub }, data });
    if (result.count === 0) return NextResponse.json({ error: "feed not found" }, { status: 404 });
    const feed = await prisma.feed.findUnique({ where: { id } });
    return NextResponse.json({ feed });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: "invalid input", issues: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "failed to update feed" }, { status: 500 });
  }
}

/** DELETE /api/me/feeds/{id} */
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireUser(req);
  if ("response" in auth) return auth.response;
  const { id } = await params;
  const result = await prisma.feed.deleteMany({ where: { id, userId: auth.user.sub } });
  if (result.count === 0) return NextResponse.json({ error: "feed not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
