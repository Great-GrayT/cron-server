import { NextResponse } from "next/server";
import { z, ZodError } from "zod";
import { prisma } from "@/db/client";
import { signJwt, verifyPassword } from "@/lib/FUNC-auth";
import { PUBLIC_USER_SELECT } from "@/lib/FUNC-account";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// `identifier` accepts an email or a username. (Legacy `email` still accepted.)
const schema = z.object({
  identifier: z.string().min(1).max(200).optional(),
  email: z.string().max(200).optional(),
  password: z.string().min(1).max(200),
});

/** POST /api/auth/login — verify credentials (email OR username), return a JWT. */
export async function POST(req: Request) {
  try {
    const body = schema.parse(await req.json());
    const raw = (body.identifier ?? body.email ?? "").trim();
    if (!raw) return NextResponse.json({ error: "identifier required" }, { status: 400 });

    const user = await prisma.user.findFirst({
      where: { OR: [{ email: raw.toLowerCase() }, { username: raw }] },
    });

    // Same response whether the account is unknown or the password is wrong.
    if (!user || !user.passwordHash || !verifyPassword(body.password, user.passwordHash)) {
      return NextResponse.json({ error: "invalid credentials" }, { status: 401 });
    }

    if (!user.emailVerified) {
      return NextResponse.json(
        { error: "email_not_verified", message: "Please verify your email before logging in." },
        { status: 403 },
      );
    }

    const token = signJwt({ sub: user.id, email: user.email, role: user.role });
    const safeUser = await prisma.user.findUnique({ where: { id: user.id }, select: PUBLIC_USER_SELECT });
    return NextResponse.json({ token, user: safeUser });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: "invalid input", issues: error.issues }, { status: 400 });
    }
    return NextResponse.json(
      { error: "login failed", message: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    );
  }
}
