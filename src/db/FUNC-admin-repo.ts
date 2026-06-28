import { prisma } from "@/db/client";
import { decryptSecret, maskSecret } from "@/lib/FUNC-crypto";
import { listApplied } from "@/db/FUNC-applied-repo";

/** Admin-only aggregations over every user's resources. */

function safeMask(enc: string): string {
  try {
    return maskSecret(decryptSecret(enc));
  } catch {
    return "•••";
  }
}

export async function adminListUsers() {
  return prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      email: true,
      username: true,
      name: true,
      role: true,
      emailVerified: true,
      revokedPages: true,
      avatarUrl: true,
      createdAt: true,
      _count: { select: { feeds: true, channels: true, schedules: true, appliedJobs: true } },
    },
  });
}

export async function adminUserDetail(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true, email: true, username: true, name: true, role: true, emailVerified: true,
      revokedPages: true, avatarUrl: true, createdAt: true,
      phoneDialCode: true, phoneNumber: true, mobileDialCode: true, mobileNumber: true,
      speciality: true, country: true, city: true,
    },
  });
  if (!user) return null;

  const [feeds, channels, schedules, applied] = await Promise.all([
    prisma.feed.findMany({ where: { userId }, orderBy: { createdAt: "desc" } }),
    prisma.notificationChannel.findMany({ where: { userId } }),
    prisma.schedule.findMany({ where: { userId }, orderBy: { job: "asc" } }),
    listApplied(userId),
  ]);

  return {
    user,
    feeds,
    channels: channels.map((c) => ({
      id: c.id, kind: c.kind, chatId: c.chatId, active: c.active,
      lastStatus: c.lastStatus, lastTestedAt: c.lastTestedAt, lastError: c.lastError,
      botTokenMasked: safeMask(c.botTokenEnc),
    })),
    schedules,
    applied,
  };
}
