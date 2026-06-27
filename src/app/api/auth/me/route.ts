import { NextResponse } from "next/server";
import { z, ZodError } from "zod";
import { prisma } from "@/db/client";
import { requireUser } from "@/lib/FUNC-current-user";
import { PUBLIC_USER_SELECT, profileSchema, cleanProfile } from "@/lib/FUNC-account";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** GET /api/auth/me — current account profile (requires Bearer JWT). */
export async function GET(req: Request) {
  const auth = requireUser(req);
  if ("response" in auth) return auth.response;

  const user = await prisma.user.findUnique({
    where: { id: auth.user.sub },
    select: PUBLIC_USER_SELECT,
  });
  if (!user) return NextResponse.json({ error: "user not found" }, { status: 404 });
  return NextResponse.json({ user });
}

const patchSchema = profileSchema.extend({ name: z.string().max(120).optional() });

/** PATCH /api/auth/me — update the user's extended profile. */
export async function PATCH(req: Request) {
  const auth = requireUser(req);
  if ("response" in auth) return auth.response;
  try {
    const body = patchSchema.parse(await req.json());
    const { name, ...rest } = body;
    const profile = cleanProfile(rest);

    if (profile.username) {
      const taken = await prisma.user.findFirst({
        where: { username: profile.username, NOT: { id: auth.user.sub } },
      });
      if (taken) return NextResponse.json({ error: "username already taken" }, { status: 409 });
    }

    const user = await prisma.user.update({
      where: { id: auth.user.sub },
      data: { ...profile, ...(name !== undefined ? { name } : {}) },
      select: PUBLIC_USER_SELECT,
    });
    return NextResponse.json({ user });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: "invalid input", issues: error.issues }, { status: 400 });
    }
    return NextResponse.json(
      { error: "profile update failed", message: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    );
  }
}
