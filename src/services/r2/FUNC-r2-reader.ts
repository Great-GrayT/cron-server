import { S3Client, GetObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { createGunzip } from "node:zlib";
import { createInterface } from "node:readline";
import { Readable } from "node:stream";

/**
 * Read-only Cloudflare R2 client for the g2 backfill — STREAMING + format-aware.
 *
 * The old importer buffered whole files (gunzipSync a full day, JSON.parse every
 * line into one array) which spiked memory and blocked the event loop, so the
 * one long request timed out at the gateway (502). This reader instead pushes
 * records to the caller in bounded batches, never holding a whole file:
 *
 *   .ndjson.gz  -> Body stream -> createGunzip() -> readline -> flush batches
 *   .parquet    -> hyparquet over an S3 *ranged-GET* buffer -> row-group by group
 *   .json       -> small control files only (manifest); parsed whole
 *
 * `streamRecords()` dispatches on the key suffix, so a manifest entry can point
 * at any of these formats and the worker doesn't care which. Credentials are
 * passed in per call (forwarded from the admin page) — never stored.
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

/** Called with each bounded batch of decoded records. Awaited (back-pressure). */
export type OnBatch<T> = (batch: T[]) => Promise<void>;

const DEFAULT_BATCH = 1000;

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

function isNotFound(error: unknown): boolean {
  const e = error as { name?: string; $metadata?: { httpStatusCode?: number } };
  return e?.name === "NoSuchKey" || e?.name === "NotFound" || e?.$metadata?.httpStatusCode === 404;
}

// ---- small control files (manifest) -----------------------------------------

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

export function getManifest(c: R2Credentials): Promise<Manifest | null> {
  return getJSON<Manifest>(c, "manifest.json");
}

// ---- streaming ndjson (.ndjson / .ndjson.gz) --------------------------------

/**
 * Stream a (optionally gzipped) NDJSON object line-by-line, flushing decoded
 * rows in batches of `batchSize`. Returns the total number of rows read.
 * Missing object -> returns 0 (idempotent).
 */
export async function streamNDJSON<T>(
  c: R2Credentials,
  key: string,
  onBatch: OnBatch<T>,
  batchSize = DEFAULT_BATCH,
): Promise<number> {
  const { s3, bucket } = client(c);
  let res;
  try {
    res = await s3.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
  } catch (error) {
    if (isNotFound(error)) return 0;
    throw error;
  }
  if (!res.Body) return 0;

  let stream = res.Body as Readable;
  if (key.endsWith(".gz")) stream = stream.pipe(createGunzip());

  const rl = createInterface({ input: stream, crlfDelay: Infinity });
  let batch: T[] = [];
  let total = 0;

  for await (const line of rl) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    let row: T;
    try {
      row = JSON.parse(trimmed) as T;
    } catch {
      continue; // skip a corrupt line rather than abort the whole import
    }
    batch.push(row);
    total++;
    if (batch.length >= batchSize) {
      await onBatch(batch);
      batch = [];
    }
  }
  if (batch.length) await onBatch(batch);
  return total;
}

// ---- streaming parquet (.parquet) via ranged GETs ---------------------------

/** hyparquet's AsyncBuffer: random-access byte ranges, fetched on demand. */
interface AsyncBuffer {
  byteLength: number;
  slice(start: number, end?: number): Promise<ArrayBuffer>;
}

async function s3AsyncBuffer(c: R2Credentials, key: string): Promise<AsyncBuffer> {
  const { s3, bucket } = client(c);
  const head = await s3.send(new HeadObjectCommand({ Bucket: bucket, Key: key }));
  const byteLength = head.ContentLength ?? 0;
  return {
    byteLength,
    async slice(start: number, end?: number): Promise<ArrayBuffer> {
      const last = (end ?? byteLength) - 1; // HTTP Range end is inclusive
      const res = await s3.send(
        new GetObjectCommand({ Bucket: bucket, Key: key, Range: `bytes=${start}-${last}` }),
      );
      const bytes = await res.Body!.transformToByteArray();
      // Copy into a tightly-sized, standalone ArrayBuffer for hyparquet.
      const out = new ArrayBuffer(bytes.byteLength);
      new Uint8Array(out).set(bytes);
      return out;
    },
  };
}

/**
 * Stream a parquet object row-group by row-group (hyparquet only fetches the
 * byte ranges it needs), flushing decoded rows in batches. Never pulls the whole
 * file. Returns total rows read; missing object -> 0.
 */
export async function streamParquet<T = Record<string, unknown>>(
  c: R2Credentials,
  key: string,
  onBatch: OnBatch<T>,
  batchSize = DEFAULT_BATCH,
): Promise<number> {
  let file: AsyncBuffer;
  try {
    file = await s3AsyncBuffer(c, key);
  } catch (error) {
    if (isNotFound(error)) return 0;
    throw error;
  }
  if (!file.byteLength) return 0;

  // ESM-only package — dynamic import keeps it out of the edge bundle.
  const { parquetMetadataAsync, parquetReadObjects } = await import("hyparquet");
  const metadata = await parquetMetadataAsync(file);

  let total = 0;
  let rowStart = 0;
  for (const group of metadata.row_groups) {
    const rows = Number(group.num_rows);
    const rowEnd = rowStart + rows;
    // Read one row group; sub-batch if the group is larger than batchSize.
    for (let from = rowStart; from < rowEnd; from += batchSize) {
      const to = Math.min(from + batchSize, rowEnd);
      const objs = (await parquetReadObjects({ file, metadata, rowStart: from, rowEnd: to })) as T[];
      if (objs.length) {
        await onBatch(objs);
        total += objs.length;
      }
    }
    rowStart = rowEnd;
  }
  return total;
}

// ---- suffix dispatch --------------------------------------------------------

/**
 * Stream records from any supported R2 object, dispatching on the key suffix so
 * the worker is format-agnostic (a manifest entry may be ndjson.gz or parquet).
 */
export async function streamRecords<T = Record<string, unknown>>(
  c: R2Credentials,
  key: string,
  onBatch: OnBatch<T>,
  batchSize = DEFAULT_BATCH,
): Promise<number> {
  if (key.endsWith(".parquet")) return streamParquet<T>(c, key, onBatch, batchSize);
  if (key.endsWith(".ndjson.gz") || key.endsWith(".ndjson") || key.endsWith(".gz"))
    return streamNDJSON<T>(c, key, onBatch, batchSize);
  if (key.endsWith(".json")) {
    // A plain JSON array/object: parse whole (control-file sized only).
    const data = await getJSON<T[] | { jobs?: T[] } | T>(c, key);
    const arr: T[] = Array.isArray(data)
      ? data
      : Array.isArray((data as { jobs?: T[] })?.jobs)
        ? (data as { jobs: T[] }).jobs
        : data
          ? [data as T]
          : [];
    let total = 0;
    for (let i = 0; i < arr.length; i += batchSize) {
      const slice = arr.slice(i, i + batchSize);
      await onBatch(slice);
      total += slice.length;
    }
    return total;
  }
  throw new Error(`Unsupported R2 object format for key: ${key}`);
}
