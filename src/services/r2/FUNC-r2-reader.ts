import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { gunzipSync } from "node:zlib";

/**
 * Read-only Cloudflare R2 client for the one-time g2 backfill.
 *
 * Mirrors the old app's storage layout:
 *   manifest.json                         (index)
 *   metadata/YYYY/MM/day-DD.ndjson.gz     (job metadata, gzipped NDJSON)
 *
 * Credentials come from R2_* env vars. Only GET is implemented.
 */

export interface ManifestDay {
  date: string;
  metadata: string;
  descriptions: string;
  jobCount: number;
}
export interface ManifestMonth {
  totalJobs: number;
  days: ManifestDay[];
}
export interface Manifest {
  currentMonth: string;
  months: Record<string, ManifestMonth>;
  availableMonths: string[];
  totalJobsAllTime: number;
}

function client(): { s3: S3Client; bucket: string } {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucket = process.env.R2_BUCKET_NAME;
  if (!accountId || !accessKeyId || !secretAccessKey || !bucket) {
    throw new Error("R2 not configured — set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME.");
  }
  return {
    bucket,
    s3: new S3Client({
      region: "auto",
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: { accessKeyId, secretAccessKey },
    }),
  };
}

export async function getJSON<T>(key: string): Promise<T | null> {
  const { s3, bucket } = client();
  try {
    const res = await s3.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
    const body = await res.Body?.transformToString();
    return body ? (JSON.parse(body) as T) : null;
  } catch (error) {
    if (isNotFound(error)) return null;
    throw error;
  }
}

export async function getNDJSONGzipped<T>(key: string): Promise<T[]> {
  const { s3, bucket } = client();
  try {
    const res = await s3.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
    const bytes = await res.Body?.transformToByteArray();
    if (!bytes) return [];
    const text = gunzipSync(Buffer.from(bytes)).toString("utf-8");
    return text
      .split("\n")
      .filter((l) => l.trim())
      .map((l) => JSON.parse(l) as T);
  } catch (error) {
    if (isNotFound(error)) return [];
    throw error;
  }
}

export function getManifest(): Promise<Manifest | null> {
  return getJSON<Manifest>("manifest.json");
}

function isNotFound(error: unknown): boolean {
  const e = error as { name?: string; $metadata?: { httpStatusCode?: number } };
  return e?.name === "NoSuchKey" || e?.$metadata?.httpStatusCode === 404;
}
