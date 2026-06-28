import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/FUNC-current-user";
import { adminListUsers } from "@/db/FUNC-admin-repo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** GET /api/admin/users — every account + resource counts (admin only). */
export async function GET(req: Request) {
  const auth = await requireAdmin(req);
  if ("response" in auth) return auth.response;
  const users = await adminListUsers();
  return NextResponse.json({ users });
}
