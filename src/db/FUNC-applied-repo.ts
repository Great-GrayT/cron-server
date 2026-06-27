import type { AppliedJob } from "@prisma/client";
import { prisma } from "@/db/client";
import { generateJobId } from "@/lib/FUNC-tracking-url";
import type { TrackingJobData } from "@/types/applied-job";

/**
 * Per-user applied-jobs store. Replaces the old default/aryan R2 namespaces:
 * each row belongs to one user (the namespace in the tracking link is their id).
 */

// Shape the /applied frontend expects (kept identical to the legacy R2 store).
export interface AppliedJobDTO {
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

export interface AppliedStats {
  totalApplications: number;
  applicationsByMonth: Record<string, number>;
  lastUpdated: string;
}

function toDTO(r: AppliedJob): AppliedJobDTO {
  return {
    id: r.id,
    jobId: r.jobId,
    appliedAt: r.appliedAt.toISOString(),
    jobTitle: r.title,
    company: r.company,
    location: r.location,
    city: r.city ?? undefined,
    country: r.country ?? undefined,
    region: r.region ?? undefined,
    originalUrl: r.jobUrl,
    postedDate: r.postedDate ? r.postedDate.toISOString() : "",
    roleType: r.roleType ?? undefined,
    industry: r.industry ?? undefined,
  };
}

/** YYYY-MM -> [from, to) UTC month window. */
function monthRange(month: string): { gte: Date; lt: Date } | null {
  if (!/^\d{4}-\d{2}$/.test(month)) return null;
  const [y, m] = month.split("-").map(Number);
  return { gte: new Date(Date.UTC(y, m - 1, 1)), lt: new Date(Date.UTC(y, m, 1)) };
}

export async function listApplied(userId: string, month?: string): Promise<AppliedJobDTO[]> {
  const range = month ? monthRange(month) : null;
  const rows = await prisma.appliedJob.findMany({
    where: { userId, ...(range ? { appliedAt: range } : {}) },
    orderBy: { appliedAt: "desc" },
  });
  return rows.map(toDTO);
}

export async function appliedStats(userId: string): Promise<AppliedStats> {
  const rows = await prisma.appliedJob.findMany({
    where: { userId },
    select: { appliedAt: true },
  });
  const applicationsByMonth: Record<string, number> = {};
  for (const r of rows) {
    const key = r.appliedAt.toISOString().slice(0, 7); // YYYY-MM
    applicationsByMonth[key] = (applicationsByMonth[key] || 0) + 1;
  }
  return {
    totalApplications: rows.length,
    applicationsByMonth,
    lastUpdated: new Date().toISOString(),
  };
}

/** Record (or refresh) an application from a clicked tracking link. */
export async function recordApplied(userId: string, data: TrackingJobData): Promise<void> {
  const jobId = generateJobId(data.jobUrl);
  const base = {
    jobUrl: data.jobUrl,
    title: data.title,
    company: data.company,
    location: data.location,
    postedDate: data.postedDate ? new Date(data.postedDate) : null,
    roleType: data.roleType || null,
    industry: data.industry || null,
  };
  await prisma.appliedJob.upsert({
    where: { userId_jobId: { userId, jobId } },
    update: { appliedAt: new Date(), ...base },
    create: { userId, jobId, ...base },
  });
}

export async function removeApplied(userId: string, id: string): Promise<number> {
  const res = await prisma.appliedJob.deleteMany({ where: { id, userId } });
  return res.count;
}

export async function clearApplied(userId: string): Promise<number> {
  const res = await prisma.appliedJob.deleteMany({ where: { userId } });
  return res.count;
}
