import { NextResponse } from "next/server";
import { z, ZodError } from "zod";
import { Prisma } from "@prisma/client";
import { prisma } from "@/db/client";
import { hashPassword } from "@/lib/FUNC-auth";
import { PUBLIC_USER_SELECT, profileSchema, cleanProfile, issueVerification } from "@/lib/FUNC-account";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = profileSchema.extend({
  email: z.string().email().max(200),
  password: z.string().min(8).max(200),
  name: z.string().max(120).optional(),
});

/**
 * POST /api/auth/register
 *
 * Creates an unverified account and emails a verification link. Does NOT return
 * a session token — the user must verify their email before they can log in.
 */
export async function POST(req: Request) {
  try {
    const body = schema.parse(await req.json());
    const email = body.email.toLowerCase().trim();
    const { email: _e, password: _p, name: _n, ...rest } = body;
    const profile = cleanProfile(rest);

    if (await prisma.user.findUnique({ where: { email } })) {
      return NextResponse.json({ error: "email already registered" }, { status: 409 });
    }
    if (profile.username) {
      const taken = await prisma.user.findUnique({ where: { username: profile.username } });
      if (taken) return NextResponse.json({ error: "username already taken" }, { status: 409 });
    }

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: hashPassword(body.password),
        name: body.name ?? ([profile.firstName, profile.lastName].filter(Boolean).join(" ") || null),
        emailVerified: false,
        ...profile,
      },
      select: PUBLIC_USER_SELECT,
    });

    await issueVerification(user.id, user.email);

    return NextResponse.json({ user, requiresVerification: true }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: "invalid input", issues: error.issues }, { status: 400 });
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ error: "email or username already registered" }, { status: 409 });
    }
    return NextResponse.json(
      { error: "registration failed", message: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    );
  }
}
