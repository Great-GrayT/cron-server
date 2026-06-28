import { NextResponse } from "next/server";
import { verifyJwt, type JwtPayload } from "@/lib/FUNC-auth";
import { prisma } from "@/db/client";

/**
 * Request authentication helper for the dashboard (`/api/me/*`) routes.
 *
 * Reads `Authorization: Bearer <jwt>`, verifies it, and returns the user claims.
 * `requireUser` returns either the user or a ready 401 response, so handlers do:
 *
 *   const auth = requireUser(req);
 *   if ("response" in auth) return auth.response;
 *   const userId = auth.user.sub;
 */
export function getUser(req: Request): JwtPayload | null {
  const header = req.headers.get("authorization") ?? "";
  if (!header.startsWith("Bearer ")) return null;
  return verifyJwt(header.slice(7));
}

export function requireUser(req: Request): { user: JwtPayload } | { response: NextResponse } {
  const user = getUser(req);
  if (!user) {
    return { response: NextResponse.json({ error: "unauthorized" }, { status: 401 }) };
  }
  return { user };
}

/**
 * Admin gate. Re-checks the role in the DB (not just the JWT) so promoting a
 * user to admin via a manual DB flag takes effect without forcing a re-login.
 */
export async function requireAdmin(
  req: Request,
): Promise<{ user: JwtPayload } | { response: NextResponse }> {
  const user = getUser(req);
  if (!user) {
    return { response: NextResponse.json({ error: "unauthorized" }, { status: 401 }) };
  }
  const row = await prisma.user.findUnique({ where: { id: user.sub }, select: { role: true } });
  if (row?.role !== "admin") {
    return { response: NextResponse.json({ error: "forbidden (admin only)" }, { status: 403 }) };
  }
  return { user };
}
