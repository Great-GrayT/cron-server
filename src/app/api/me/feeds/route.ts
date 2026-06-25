import { NextResponse } from "next/server";
import { z, ZodError } from "zod";
import { prisma } from "@/db/client";
import { requireUser } from "@/lib/FUNC-current-user";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const createSchema = z.object({
  url: z.string().url().max(500),
  name: z.string().max(120).optional(),
  notify: z.boolean().default(true),
  shareToStats: z.boolean().default(false),
});

/** GET /api/me/feeds — list the current user's feeds. */
export async function GET(req: Request) {
  const auth = requireUser(req);
  if ("response" in auth) return auth.response;
  const feeds = await prisma.feed.findMany({
    where: { userId: auth.user.sub },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ feeds });
}

/** POST /api/me/feeds — add a feed (personal, optionally shared to public stats). */
export async function POST(req: Request) {
  const auth = requireUser(req);
  if ("response" in auth) return auth.response;
  try {
    const data = createSchema.parse(await req.json());
    const feed = await prisma.feed.create({ data: { ...data, userId: auth.user.sub } });
    return NextResponse.json({ feed }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: "invalid input", issues: error.issues }, { status: 400 });
    }
    // Unique violation = same URL already added by this user.
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return NextResponse.json({ error: "feed url already added" }, { status: 409 });
    }
    return NextResponse.json({ error: "failed to add feed" }, { status: 500 });
  }
}
