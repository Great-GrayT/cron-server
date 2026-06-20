import { NextResponse } from "next/server";
import { jobDescription } from "@/db/FUNC-stats-repo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/v1/jobs/{id}
 *
 * On-demand job description fetch (the heavy field excluded from list views).
 */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const description = await jobDescription(id);
    if (description === null) {
      return NextResponse.json({ error: "job not found", id }, { status: 404 });
    }
    return NextResponse.json({ success: true, id, description });
  } catch (error) {
    return NextResponse.json(
      { error: "description query failed", message: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    );
  }
}
