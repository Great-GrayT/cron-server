import { prisma } from "@/db/client";
import { logger } from "@/lib/logger";

/**
 * Postgres-backed dedup ledger — drop-in replacement for the old R2 `UrlCache`.
 *
 * Keeps the same interface (load / has / add / save / size) so the ported
 * orchestrators need no changes. This is the PER-USER (Telegram) dedup only:
 * URLs expire 7 days after their per-URL timestamp (a job reappearing after a
 * week is treated as new), and expired rows are pruned by the cron tick. The
 * stats/DB dedup (Job/UserJob) is separate — global and kept forever.
 */
const CACHE_EXPIRY_HOURS = 24 * 7; // 7 days

export class SentUrlCache {
  private readonly namespace: string;
  private known = new Map<string, Date>(); // url -> expiresAt (loaded, non-expired)
  private pending = new Map<string, Date>(); // url -> expiresAt (to persist on save)

  constructor(namespace: string) {
    this.namespace = namespace;
  }

  private normalize(url: string): string {
    return url.toLowerCase().trim();
  }

  private expiryFrom(timestamp?: string | Date): Date {
    const base = timestamp ? new Date(timestamp) : new Date();
    const ms = Number.isNaN(base.getTime()) ? Date.now() : base.getTime();
    return new Date(ms + CACHE_EXPIRY_HOURS * 60 * 60 * 1000);
  }

  /** Load all non-expired URLs for this namespace into memory. */
  async load(): Promise<void> {
    const rows = await prisma.sentUrl.findMany({
      where: { namespace: this.namespace, expiresAt: { gt: new Date() } },
      select: { url: true, expiresAt: true },
    });
    this.known = new Map(rows.map((r) => [r.url, r.expiresAt]));
    logger.info(`✓ Loaded dedup ledger [${this.namespace}]: ${this.known.size} live URLs`);
  }

  has(url: string): boolean {
    const key = this.normalize(url);
    if (this.pending.has(key)) return true;
    const expiry = this.known.get(key);
    return expiry !== undefined && expiry.getTime() > Date.now();
  }

  /** Stage a URL for persistence; `timestamp` drives the 7-day expiry. */
  add(url: string, timestamp?: string | Date): void {
    this.pending.set(this.normalize(url), this.expiryFrom(timestamp));
  }

  /** Upsert staged URLs; refresh expiry on conflict. */
  async save(): Promise<void> {
    if (this.pending.size === 0) return;
    const ops = Array.from(this.pending.entries()).map(([url, expiresAt]) =>
      prisma.sentUrl.upsert({
        where: { namespace_url: { namespace: this.namespace, url } },
        create: { namespace: this.namespace, url, expiresAt },
        update: { expiresAt },
      }),
    );
    await prisma.$transaction(ops);
    for (const [url, expiresAt] of this.pending) this.known.set(url, expiresAt);
    logger.info(`✓ Saved dedup ledger [${this.namespace}]: +${this.pending.size} URLs`);
    this.pending.clear();
  }

  size(): number {
    return this.known.size + this.pending.size;
  }

  /** Opportunistic cleanup of expired rows for this namespace. */
  async purgeExpired(): Promise<number> {
    const { count } = await prisma.sentUrl.deleteMany({
      where: { namespace: this.namespace, expiresAt: { lt: new Date() } },
    });
    if (count > 0) logger.info(`Purged ${count} expired URLs [${this.namespace}]`);
    return count;
  }
}

/**
 * Global housekeeping: delete every expired per-user dedup row (all namespaces).
 * Called from the cron tick. The stats dedup (Job/UserJob) is never pruned.
 */
export async function pruneExpiredSentUrls(): Promise<number> {
  const { count } = await prisma.sentUrl.deleteMany({ where: { expiresAt: { lt: new Date() } } });
  if (count > 0) logger.info(`pruned ${count} expired sent-url dedup rows`);
  return count;
}
