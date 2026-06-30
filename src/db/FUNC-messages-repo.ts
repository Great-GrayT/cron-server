import { prisma } from "@/db/client";

/**
 * Direct messaging. A message goes to a specific user (toUserId) or to the admin
 * pool (toAdmin=true). Admins see the admin pool in their inbox; replies are new
 * rows in the opposite direction.
 */

const FROM_SELECT = {
  select: { id: true, email: true, username: true, name: true, avatarUrl: true, role: true },
};

export interface SendInput {
  toIdentifier?: string | null; // email or username; empty => to admin
  toAdmin?: boolean;
  subject?: string | null;
  body: string;
}

export async function sendMessage(fromUserId: string, input: SendInput) {
  const ident = input.toIdentifier?.trim();
  let toUserId: string | null = null;
  let toAdmin = input.toAdmin ?? false;

  if (ident) {
    const target = await prisma.user.findFirst({
      where: { OR: [{ email: ident.toLowerCase() }, { username: ident }] },
      select: { id: true },
    });
    if (!target) return { error: "recipient not found" as const };
    toUserId = target.id;
    toAdmin = false;
  } else {
    toAdmin = true; // default destination
  }

  const message = await prisma.message.create({
    data: { fromUserId, toUserId, toAdmin, subject: input.subject ?? null, body: input.body },
    include: { from: FROM_SELECT, to: FROM_SELECT },
  });
  return { message };
}

export async function listInbox(userId: string, isAdmin: boolean) {
  return prisma.message.findMany({
    where: {
      fromUserId: { not: userId },
      OR: [{ toUserId: userId }, ...(isAdmin ? [{ toAdmin: true }] : [])],
    },
    include: { from: FROM_SELECT, to: FROM_SELECT },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
}

export async function listSent(userId: string) {
  return prisma.message.findMany({
    where: { fromUserId: userId },
    include: { from: FROM_SELECT, to: FROM_SELECT },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
}

export async function unreadCount(userId: string, isAdmin: boolean): Promise<number> {
  return prisma.message.count({
    where: {
      readAt: null,
      fromUserId: { not: userId },
      OR: [{ toUserId: userId }, ...(isAdmin ? [{ toAdmin: true }] : [])],
    },
  });
}

/** Hard-delete a message by id (admin only — enforced at the route). */
export async function deleteMessage(id: string): Promise<number> {
  const res = await prisma.message.deleteMany({ where: { id } });
  return res.count;
}

export async function markRead(userId: string, isAdmin: boolean, id: string): Promise<number> {
  const res = await prisma.message.updateMany({
    where: {
      id,
      readAt: null,
      OR: [{ toUserId: userId }, ...(isAdmin ? [{ toAdmin: true }] : [])],
    },
    data: { readAt: new Date() },
  });
  return res.count;
}
