/**
 * Applied-jobs tracking types.
 *
 * Ported from the original app and decoupled from the R2 store: the cron +
 * Telegram pipeline only needs these shapes to build signed "Apply here"
 * tracking links (see FUNC-tracking-url.ts). The click-logging endpoint itself
 * is a separate concern outside this milestone.
 */

// A tracking-link namespace is now the owning user's id (the per-user applied
// store). "default" is kept as a backward-compatible fallback for links issued
// before per-user tracking; any non-empty string is a valid namespace.
export type AppliedNamespace = string;

export function isAppliedNamespace(value: string | null | undefined): value is AppliedNamespace {
  return typeof value === "string" && value.length > 0;
}

export interface AppliedJob {
  id: string;
  jobId: string;
  appliedAt: string;
  jobTitle: string;
  company: string;
  location: string;
  city?: string;
  country?: string;
  region?: string;
  originalUrl: string;
  postedDate: string;
  roleType?: string;
  industry?: string;
}

export interface TrackingJobData {
  jobUrl: string;
  title: string;
  company: string;
  location: string;
  postedDate: string;
  roleType?: string;
  industry?: string;
}
