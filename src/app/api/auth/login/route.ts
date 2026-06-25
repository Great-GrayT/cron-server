import { NextResponse } from "next/server";
import { z, ZodError } from "zod";
import { prisma } from "@/db/client";
import { signJwt, verifyPassword } from "@/lib/FUNC-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({
  email: z.string().email().max(200),
  password: z.string().min(1).max(200),
});

/** POST /api/auth/login — verify credentials, return a JWT. */
export async function POST(req: Request) {
  try {
    const { email, password } = schema.parse(await req.json());
    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });

    // Same response whether the email is unknown or the password is wrong.
    if (!user || !user.passwordHash || !verifyPassword(password, user.passwordHash)) {
      return NextResponse.json({ error: "invalid email or password" }, { status: 401 });
    }

    const token = signJwt({ sub: user.id, email: user.email, role: user.role });
    return NextResponse.json({
      token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    });
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
