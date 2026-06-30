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
      avatarData: true,
      createdAt: true,
      _count: { select: { feeds: true, channels: true, schedules: true, appliedJobs: true } },
    },
  });
}

/**
 * Permanently delete a user. Their RSS feeds are KEPT — reassigned to the oldest
 * admin and made public (shareToStats) — while everything else (Telegram channels,
 * tracking, schedules, messages, tokens…) is removed by the DB cascade.
 * Feeds whose url the inheriting admin already owns are dropped (unique conflict).
 */
export async function deleteUserAndReassignFeeds(
  targetId: string,
): Promise<{ ok: true; reassigned: number } | { error: string }> {
  const target = await prisma.user.findUnique({ where: { id: targetId }, select: { id: true } });
  if (!target) return { error: "user not found" };

  const inheritor = await prisma.user.findFirst({
    where: { role: "admin", id: { not: targetId } },
    orderBy: { createdAt: "asc" },
    select: { id: true },
  });
  if (!inheritor) return { error: "no other admin available to inherit the feeds" };

  const [targetFeeds, inheritorFeeds] = await Promise.all([
    prisma.feed.findMany({ where: { userId: targetId }, select: { id: true, url: true } }),
    prisma.feed.findMany({ where: { userId: inheritor.id }, select: { url: true } }),
  ]);
  const owned = new Set(inheritorFeeds.map((f) => f.url));
  const reassignIds = targetFeeds.filter((f) => !owned.has(f.url)).map((f) => f.id);

  await prisma.$transaction([
    prisma.feed.updateMany({
      where: { id: { in: reassignIds } },
      data: { userId: inheritor.id, shareToStats: true },
    }),
    // Cascade removes channels, schedules, applied, messages, tokens, oauth, and any
    // feeds NOT reassigned above.
    prisma.user.delete({ where: { id: targetId } }),
  ]);

  return { ok: true, reassigned: reassignIds.length };
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
