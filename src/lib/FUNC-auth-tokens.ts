import crypto from "crypto";
import { prisma } from "@/db/client";

/**
 * Single-use email-verification / password-reset tokens. The raw token is
 * emailed to the user; only its sha256 hash is stored, so a DB leak can't be
 * replayed. Creating a new token of a type invalidates the user's old ones.
 */

export type AuthTokenType = "email_verify" | "password_reset";

const TTL: Record<AuthTokenType, number> = {
  email_verify: 24 * 60 * 60 * 1000, // 24h
  password_reset: 60 * 60 * 1000, // 1h
};

function hash(raw: string): string {
  return crypto.createHash("sha256").update(raw).digest("hex");
}

/** Create a token, return the raw value to embed in the email link. */
export async function createAuthToken(userId: string, type: AuthTokenType): Promise<string> {
  const raw = crypto.randomBytes(32).toString("base64url");
  await prisma.authToken.deleteMany({ where: { userId, type } });
  await prisma.authToken.create({
    data: { userId, type, tokenHash: hash(raw), expiresAt: new Date(Date.now() + TTL[type]) },
  });
  return raw;
}

/** Validate + consume a token. Returns the userId, or null if invalid/expired. */
export async function consumeAuthToken(raw: string, type: AuthTokenType): Promise<string | null> {
  if (!raw) return null;
  const row = await prisma.authToken.findFirst({ where: { tokenHash: hash(raw), type } });
  if (!row) return null;
  await prisma.authToken.delete({ where: { id: row.id } });
  if (row.expiresAt.getTime() < Date.now()) return null;
  return row.userId;
}
