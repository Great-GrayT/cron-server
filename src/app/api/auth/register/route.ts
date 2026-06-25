import { NextResponse } from "next/server";
import { z, ZodError } from "zod";
import { prisma } from "@/db/client";
import { hashPassword, signJwt } from "@/lib/FUNC-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({
  email: z.string().email().max(200),
  password: z.string().min(8).max(200),
  name: z.string().max(120).optional(),
});

/** POST /api/auth/register — create an account, return a JWT. */
export async function POST(req: Request) {
  try {
    const { email, password, name } = schema.parse(await req.json());
    const normalized = email.toLowerCase().trim();

    const existing = await prisma.user.findUnique({ where: { email: normalized } });
    if (existing) {
      return NextResponse.json({ error: "email already registered" }, { status: 409 });
    }

    const user = await prisma.user.create({
      data: { email: normalized, passwordHash: hashPassword(password), name: name ?? null },
      select: { id: true, email: true, name: true, role: true },
    });

    const token = signJwt({ sub: user.id, email: user.email, role: user.role });
    return NextResponse.json({ token, user }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: "invalid input", issues: error.issues }, { status: 400 });
    }
    return NextResponse.json(
      { error: "registration failed", message: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    );
  }
}
