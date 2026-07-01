import { NextRequest, NextResponse } from "next/server";
import { searchFieldValues, fieldHasDictionary } from "@/analysis/FUNC-field-values";

/**
 * GET /api/dictionaries/{field}?q=&limit=
 *
 * Server-side type-ahead for the JFS filter builder. Searches the whole
 * dictionary for `field` and returns up to `limit` matches — the client never
 * loads the full dictionary.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest, { params }: { params: Promise<{ field: string }> }) {
  const { field } = await params;
  if (!fieldHasDictionary(field)) {
    return NextResponse.json({ error: `no dictionary for field '${field}'`, values: [] }, { status: 404 });
  }
  const q = req.nextUrl.searchParams.get("q") ?? "";
  const limit = Number(req.nextUrl.searchParams.get("limit") ?? 30);
  const values = searchFieldValues(field, q, Number.isFinite(limit) ? limit : 30);
  return NextResponse.json(
    { field, values },
    { headers: { "Cache-Control": "public, max-age=300" } },
  );
}
