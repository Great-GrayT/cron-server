-- Shared-job refactor: collapse per-user job rows into one global row per URL,
-- moving per-user ownership into a new user_jobs link table.
-- gen_random_uuid() needs pgcrypto on older Postgres.
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. Denormalized public-stats flag on the (soon global) job row.
ALTER TABLE "jobs" ADD COLUMN "shared_to_stats" BOOLEAN NOT NULL DEFAULT false;

-- 2. The link table.
CREATE TABLE "user_jobs" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "job_id" UUID NOT NULL,
    "feed_id" UUID,
    "share_to_stats" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "user_jobs_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "user_jobs_user_id_job_id_key" ON "user_jobs"("user_id", "job_id");

-- 3. Pick one canonical job row per url (earliest wins).
CREATE TEMP TABLE _canon AS
SELECT DISTINCT ON (url) url, id AS canon_id
FROM "jobs"
ORDER BY url, created_at ASC, id ASC;

-- 4. One link per existing owned job row, pointed at the canonical job.
INSERT INTO "user_jobs" (id, user_id, job_id, feed_id, share_to_stats, created_at)
SELECT gen_random_uuid(), j.user_id, c.canon_id, j.feed_id, j.share_to_stats, j.created_at
FROM "jobs" j
JOIN _canon c ON c.url = j.url
WHERE j.user_id IS NOT NULL
ON CONFLICT ("user_id", "job_id") DO NOTHING;

-- 5. shared_to_stats on the canonical job = OR of every original row's flag
--    (covers legacy/global rows that had no user).
UPDATE "jobs" j
SET "shared_to_stats" = sub.shared
FROM (
  SELECT c.canon_id, bool_or(o.share_to_stats) AS shared
  FROM "jobs" o
  JOIN _canon c ON c.url = o.url
  GROUP BY c.canon_id
) sub
WHERE j.id = sub.canon_id;

-- 6. Drop the duplicate (non-canonical) job rows.
DELETE FROM "jobs" WHERE id NOT IN (SELECT canon_id FROM _canon);

-- 7. Drop the old per-user ownership on jobs.
ALTER TABLE "jobs" DROP CONSTRAINT IF EXISTS "jobs_user_id_fkey";
ALTER TABLE "jobs" DROP CONSTRAINT IF EXISTS "jobs_feed_id_fkey";
DROP INDEX IF EXISTS "jobs_user_id_url_key";
DROP INDEX IF EXISTS "jobs_user_id_idx";
DROP INDEX IF EXISTS "jobs_share_to_stats_idx";
ALTER TABLE "jobs"
  DROP COLUMN "user_id",
  DROP COLUMN "feed_id",
  DROP COLUMN "share_to_stats";

-- 8. Global url uniqueness + new indexes.
CREATE UNIQUE INDEX "jobs_url_key" ON "jobs"("url");
CREATE INDEX "jobs_shared_to_stats_idx" ON "jobs"("shared_to_stats");
CREATE INDEX "user_jobs_user_id_idx" ON "user_jobs"("user_id");
CREATE INDEX "user_jobs_job_id_idx" ON "user_jobs"("job_id");

-- 9. Link-table foreign keys.
ALTER TABLE "user_jobs" ADD CONSTRAINT "user_jobs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "user_jobs" ADD CONSTRAINT "user_jobs_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "user_jobs" ADD CONSTRAINT "user_jobs_feed_id_fkey" FOREIGN KEY ("feed_id") REFERENCES "feeds"("id") ON DELETE SET NULL ON UPDATE CASCADE;
