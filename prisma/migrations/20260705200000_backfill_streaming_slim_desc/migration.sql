-- Slim the hot `jobs` fact table: move the heavy description blob into a side
-- table (job_descriptions) with its own trigram index, and drop the column +
-- index from `jobs`. Add backfill_jobs for the async R2 import progress record.

-- CreateTable: side table for the heavy description text
CREATE TABLE "job_descriptions" (
    "job_id" UUID NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "job_descriptions_pkey" PRIMARY KEY ("job_id")
);

-- Preserve existing non-empty descriptions before dropping the column
INSERT INTO "job_descriptions" ("job_id", "text")
SELECT "id", "description"
FROM "jobs"
WHERE "description" IS NOT NULL AND "description" <> '';

-- AddForeignKey
ALTER TABLE "job_descriptions" ADD CONSTRAINT "job_descriptions_job_id_fkey"
    FOREIGN KEY ("job_id") REFERENCES "jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Move the trigram index off `jobs` onto the slim side table
DROP INDEX IF EXISTS "jobs_description_trgm_idx";
CREATE INDEX "job_descriptions_text_trgm_idx" ON "job_descriptions" USING GIN ("text" gin_trgm_ops);

-- DropColumn: description now lives only in job_descriptions
ALTER TABLE "jobs" DROP COLUMN "description";

-- CreateTable: async backfill progress record (polled by the admin page)
CREATE TABLE "backfill_jobs" (
    "id" UUID NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'running',
    "phase" TEXT NOT NULL DEFAULT 'starting',
    "months_done" INTEGER NOT NULL DEFAULT 0,
    "days_done" INTEGER NOT NULL DEFAULT 0,
    "read" INTEGER NOT NULL DEFAULT 0,
    "inserted" INTEGER NOT NULL DEFAULT 0,
    "logs" JSONB NOT NULL DEFAULT '[]',
    "error" TEXT,
    "owner_id" UUID NOT NULL,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "finished_at" TIMESTAMP(3),

    CONSTRAINT "backfill_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "backfill_jobs_status_started_at_idx" ON "backfill_jobs" ("status", "started_at");
