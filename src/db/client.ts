import { PrismaClient } from "@prisma/client";

/**
 * Prisma database client (parameterised connection layer).
 *
 * A single PrismaClient is reused across the process (and dev hot reloads) so
 * we never exhaust Postgres connections under repeated cron triggers. Prisma
 * emits parameterised queries everywhere — there is no string-interpolation
 * path into SQL.
 */

const globalForPrisma = globalThis as unknown as { __prisma?: PrismaClient };

function createClient(): PrismaClient {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set — refusing to start without a database.");
  }
  return new PrismaClient({
    log: process.env.NODE_ENV === "production" ? ["error"] : ["error", "warn"],
  });
}

export const prisma = globalForPrisma.__prisma ?? createClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.__prisma = prisma;
