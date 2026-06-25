import { NextResponse } from "next/server";
import { z, ZodError } from "zod";
import { prisma } from "@/db/client";
import { requireUser } from "@/lib/FUNC-current-user";
import { encryptSecret, decryptSecret, maskSecret } from "@/lib/FUNC-crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const upsertSchema = z.object({
  kind: z.enum(["main", "goat"]),
  botToken: z.string().min(20).max(200),
  chatId: z.string().min(1).max(100),
  active: z.boolean().default(true),
});

/** GET /api/me/channels — list channels with the bot token MASKED (never raw). */
export async function GET(req: Request) {
  const auth = requireUser(req);
  if ("response" in auth) return auth.response;
  const rows = await prisma.notificationChannel.findMany({ where: { userId: auth.user.sub } });
  const channels = rows.map((c) => ({
    id: c.id,
    kind: c.kind,
    chatId: c.chatId,
    active: c.active,
    botTokenMasked: maskSecret(safeDecrypt(c.botTokenEnc)),
  }));
  return NextResponse.json({ channels });
}

/** POST /api/me/channels — create/replace the main|goat channel (token encrypted). */
export async function POST(req: Request) {
  const auth = requireUser(req);
  if ("response" in auth) return auth.response;
  try {
    const { kind, botToken, chatId, active } = upsertSchema.parse(await req.json());
    const channel = await prisma.notificationChannel.upsert({
      where: { userId_kind: { userId: auth.user.sub, kind } },
      create: { userId: auth.user.sub, kind, botTokenEnc: encryptSecret(botToken), chatId, active },
      update: { botTokenEnc: encryptSecret(botToken), chatId, active },
      select: { id: true, kind: true, chatId: true, active: true },
    });
    return NextResponse.json({ channel }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: "invalid input", issues: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "failed to save channel" }, { status: 500 });
  }
}

function safeDecrypt(enc: string): string {
  try {
    return decryptSecret(enc);
  } catch {
    return "";
  }
}
