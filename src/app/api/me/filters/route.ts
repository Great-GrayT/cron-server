import { NextResponse } from "next/server";
import { z, ZodError } from "zod";
import { prisma } from "@/db/client";
import { requireUser } from "@/lib/FUNC-current-user";
import { FILTER_FIELDS } from "@/analysis/FUNC-field-values";
import { conditionSchema } from "@/lib/FUNC-filter-schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const createSchema = z.object({
  name: z.string().min(1).max(120),
  enabled: z.boolean().default(true),
  conditions: z.array(conditionSchema).min(1).max(30),
});

/** GET /api/me/filters — the user's JFS filter sets + the field metadata. */
export async function GET(req: Request) {
  const auth = requireUser(req);
  if ("response" in auth) return auth.response;
  const filterSets = await prisma.filterSet.findMany({
    where: { userId: auth.user.sub },
    include: { conditions: { orderBy: { position: "asc" } } },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json({ filterSets, fields: FILTER_FIELDS });
}

/** POST /api/me/filters — create a filter set (job matching ANY set → filtered channel). */
export async function POST(req: Request) {
  const auth = requireUser(req);
  if ("response" in auth) return auth.response;
  try {
    const { name, enabled, conditions } = createSchema.parse(await req.json());
    const filterSet = await prisma.filterSet.create({
      data: {
        userId: auth.user.sub,
        name,
        enabled,
        conditions: { create: conditions.map((c, i) => ({ ...c, position: i })) },
      },
      include: { conditions: { orderBy: { position: "asc" } } },
    });
    return NextResponse.json({ filterSet }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: "invalid input", issues: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "failed to create filter set" }, { status: 500 });
  }
}
