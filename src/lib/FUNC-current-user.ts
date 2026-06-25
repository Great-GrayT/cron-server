import { NextResponse } from "next/server";
import { verifyJwt, type JwtPayload } from "@/lib/FUNC-auth";

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
