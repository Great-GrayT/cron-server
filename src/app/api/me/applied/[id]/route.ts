import { NextResponse } from "next/server";
import { requireUser } from "@/lib/FUNC-current-user";
import { removeApplied } from "@/db/FUNC-applied-repo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** DELETE /api/me/applied/{id} — remove one of the user's applications. */
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireUser(req);
  if ("response" in auth) return auth.response;
  const { id } = await params;
  const count = await removeApplied(auth.user.sub, id);
  if (count === 0) return NextResponse.json({ error: "application not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
