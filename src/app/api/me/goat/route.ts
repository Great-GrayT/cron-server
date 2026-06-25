import { NextResponse } from "next/server";
import { z, ZodError } from "zod";
import { prisma } from "@/db/client";
import { requireUser } from "@/lib/FUNC-current-user";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const strArr = z.array(z.string().max(120)).max(200);

const putSchema = z.object({
  enabled: z.boolean(),
  requireIndustry: z.boolean(),
  requireCategory: z.boolean(),
  categories: strArr,
  industries: strArr,
  seniorities: strArr,
  companyBlacklist: strArr,
  vipCompanies: strArr,
  locationTerms: strArr,
});

/** GET /api/me/goat — the user's GOAT filter config (null if never set). */
export async function GET(req: Request) {
  const auth = requireUser(req);
  if ("response" in auth) return auth.response;
  const config = await prisma.goatConfig.findUnique({ where: { userId: auth.user.sub } });
  return NextResponse.json({ config });
}

/** PUT /api/me/goat — create/replace the user's GOAT filter config. */
export async function PUT(req: Request) {
  const auth = requireUser(req);
  if ("response" in auth) return auth.response;
  try {
    const data = putSchema.parse(await req.json());
    const config = await prisma.goatConfig.upsert({
      where: { userId: auth.user.sub },
      create: { userId: auth.user.sub, ...data },
      update: data,
    });
    return NextResponse.json({ config });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: "invalid input", issues: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "failed to save goat config" }, { status: 500 });
  }
}
