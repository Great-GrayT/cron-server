import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { gunzipSync } from "node:zlib";

/**
 * Read-only Cloudflare R2 client for the one-time g2 backfill.
 *
 * Mirrors the old app's storage layout:
 *   manifest.json                         (index)
 *   metadata/YYYY/MM/day-DD.ndjson.gz     (job metadata, gzipped NDJSON)
 *
 * Credentials are passed in per call (the admin page forwards them from the
 * frontend host) — they are never stored. `envR2Credentials()` is a fallback
 * for running the backfill from the server's own env.
 */

export interface R2Credentials {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
}

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

/** Fallback credentials from the server env (optional). */
export function envR2Credentials(): R2Credentials | null {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucket = process.env.R2_BUCKET_NAME;
  if (!accountId || !accessKeyId || !secretAccessKey || !bucket) return null;
  return { accountId, accessKeyId, secretAccessKey, bucket };
}

function client(c: R2Credentials): { s3: S3Client; bucket: string } {
  return {
    bucket: c.bucket,
    s3: new S3Client({
      region: "auto",
      endpoint: `https://${c.accountId}.r2.cloudflarestorage.com`,
      credentials: { accessKeyId: c.accessKeyId, secretAccessKey: c.secretAccessKey },
    }),
  };
}

export async function getJSON<T>(c: R2Credentials, key: string): Promise<T | null> {
  const { s3, bucket } = client(c);
  try {
    const res = await s3.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
    const body = await res.Body?.transformToString();
    return body ? (JSON.parse(body) as T) : null;
  } catch (error) {
    if (isNotFound(error)) return null;
    throw error;
  }
}

export async function getNDJSONGzipped<T>(c: R2Credentials, key: string): Promise<T[]> {
  const { s3, bucket } = client(c);
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

export function getManifest(c: R2Credentials): Promise<Manifest | null> {
  return getJSON<Manifest>(c, "manifest.json");
}

function isNotFound(error: unknown): boolean {
  const e = error as { name?: string; $metadata?: { httpStatusCode?: number } };
  return e?.name === "NoSuchKey" || e?.$metadata?.httpStatusCode === 404;
}
