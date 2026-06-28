import { NextResponse } from "next/server";
import { z, ZodError } from "zod";
import { prisma } from "@/db/client";
import { requireUser } from "@/lib/FUNC-current-user";
import { listInbox, listSent, sendMessage, unreadCount } from "@/db/FUNC-messages-repo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function isAdmin(userId: string): Promise<boolean> {
  const u = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
  return u?.role === "admin";
}

/** GET /api/me/messages — inbox + sent + unread count. */
export async function GET(req: Request) {
  const auth = requireUser(req);
  if ("response" in auth) return auth.response;
  const admin = await isAdmin(auth.user.sub);
  const [inbox, sent, unread] = await Promise.all([
    listInbox(auth.user.sub, admin),
    listSent(auth.user.sub),
    unreadCount(auth.user.sub, admin),
  ]);
  return NextResponse.json({ inbox, sent, unread, isAdmin: admin });
}

const sendSchema = z.object({
  toIdentifier: z.string().max(200).nullable().optional(),
  toAdmin: z.boolean().optional(),
  subject: z.string().max(200).nullable().optional(),
  body: z.string().min(1).max(5000),
});

/** POST /api/me/messages — send to a user (email/username) or to admin (default). */
export async function POST(req: Request) {
  const auth = requireUser(req);
  if ("response" in auth) return auth.response;
  try {
    const input = sendSchema.parse(await req.json());
    const result = await sendMessage(auth.user.sub, input);
    if ("error" in result) return NextResponse.json({ error: result.error }, { status: 404 });
    return NextResponse.json({ message: result.message }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: "invalid input", issues: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "failed to send message" }, { status: 500 });
  }
}
