import { z } from "zod";
import type { Prisma } from "@prisma/client";
import { createAuthToken } from "@/lib/FUNC-auth-tokens";
import { sendVerificationEmail } from "@/lib/FUNC-email";

/** Fields returned to the client for the logged-in user (never the hash). */
export const PUBLIC_USER_SELECT = {
  id: true,
  email: true,
  username: true,
  name: true,
  role: true,
  firstName: true,
  lastName: true,
  phoneDialCode: true,
  phoneNumber: true,
  mobileDialCode: true,
  mobileNumber: true,
  speciality: true,
  country: true,
  city: true,
  emailVerified: true,
  avatarUrl: true,
  avatarData: true,
  revokedPages: true,
} satisfies Prisma.UserSelect;

/** Optional extended-profile fields, shared by register + profile update. */
export const profileSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(30)
    .regex(/^[a-zA-Z0-9_.-]+$/, "letters, numbers, . _ - only")
    .optional(),
  firstName: z.string().max(80).optional(),
  lastName: z.string().max(80).optional(),
  phoneDialCode: z.string().max(8).optional(),
  phoneNumber: z.string().max(30).optional(),
  mobileDialCode: z.string().max(8).optional(),
  mobileNumber: z.string().max(30).optional(),
  speciality: z.string().max(120).optional(),
  country: z.string().max(120).optional(),
  city: z.string().max(120).optional(),
  avatarUrl: z.string().max(2000).optional(),
  // Uploaded base64 data URL — capped (~5MB of base64).
  avatarData: z.string().max(7_000_000).optional(),
});

export type ProfileInput = z.infer<typeof profileSchema>;

/** Drop empty strings so optional fields stay null instead of "". */
export function cleanProfile(input: ProfileInput): ProfileInput {
  const out: Record<string, string | undefined> = {};
  for (const [k, v] of Object.entries(input)) {
    out[k] = typeof v === "string" && v.trim() === "" ? undefined : v;
  }
  return out as ProfileInput;
}

function appBaseUrl(): string {
  return (process.env.APP_BASE_URL || "http://localhost:3000").replace(/\/$/, "");
}

export function frontendUrl(): string {
  return (process.env.FRONTEND_URL || "http://localhost:3000").replace(/\/$/, "");
}

/** Create an email-verification token and send the link. */
export async function issueVerification(userId: string, email: string): Promise<void> {
  const raw = await createAuthToken(userId, "email_verify");
  const link = `${appBaseUrl()}/api/auth/verify-email?token=${raw}`;
  await sendVerificationEmail(email, link);
}
