/**
 * Normalizes an Indeed job URL to the canonical form we store and share.
 *
 * RSS feeds hand us Indeed links HTML-entity-encoded and with the wrong `from`
 * param, e.g.
 *   https://uk.indeed.com/viewjob?from=social_other&amp;jk=64db4325cd2a608f
 * which must become
 *   https://uk.indeed.com/viewjob?from=jobsearch-empty-whatwhere&jk=64db4325cd2a608f
 * so the direct "apply" link actually resolves.
 *
 * No-op for non-Indeed URLs. Idempotent — safe to call more than once.
 */
export function normalizeIndeedUrl(url: string): string {
  if (!url || !url.toLowerCase().includes("indeed")) return url;
  return url
    .replace(/&amp;/g, "&") // decode HTML-entity ampersands
    .replace("from=social_other", "from=jobsearch-empty-whatwhere");
}
