/**
 * Applied-jobs tracking types.
 *
 * Ported from the original app and decoupled from the R2 store: the cron +
 * Telegram pipeline only needs these shapes to build signed "Apply here"
 * tracking links (see FUNC-tracking-url.ts). The click-logging endpoint itself
 * is a separate concern outside this milestone.
 */

export type AppliedNamespace = "default" | "aryan";

export function isAppliedNamespace(value: string | null | undefined): value is AppliedNamespace {
  return value === "default" || value === "aryan";
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
