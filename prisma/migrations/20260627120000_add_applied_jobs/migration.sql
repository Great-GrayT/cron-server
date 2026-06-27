-- CreateTable
CREATE TABLE "applied_jobs" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "job_id" TEXT NOT NULL,
    "job_url" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "city" TEXT,
    "country" TEXT,
    "region" TEXT,
    "posted_date" TIMESTAMP(3),
    "role_type" TEXT,
    "industry" TEXT,
    "applied_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "applied_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "applied_jobs_user_id_applied_at_idx" ON "applied_jobs"("user_id", "applied_at");

-- CreateIndex
CREATE UNIQUE INDEX "applied_jobs_user_id_job_id_key" ON "applied_jobs"("user_id", "job_id");

-- AddForeignKey
ALTER TABLE "applied_jobs" ADD CONSTRAINT "applied_jobs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
