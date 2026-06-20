-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- CreateTable
CREATE TABLE "jobs" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "country" TEXT,
    "city" TEXT,
    "region" TEXT,
    "posted_date" TIMESTAMP(3) NOT NULL,
    "extracted_date" TIMESTAMP(3) NOT NULL,
    "industry" TEXT NOT NULL,
    "seniority" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "keywords" TEXT[],
    "certificates" TEXT[],
    "software" TEXT[],
    "programming_skills" TEXT[],
    "academic_degrees" TEXT[],
    "experience_years" INTEGER,
    "role_type" TEXT,
    "role_category" TEXT,
    "salary_min" DOUBLE PRECISION,
    "salary_max" DOUBLE PRECISION,
    "salary_currency" TEXT,
    "salary_period" TEXT,
    "source_feed" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sent_urls" (
    "id" UUID NOT NULL,
    "namespace" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sent_urls_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cron_runs" (
    "id" UUID NOT NULL,
    "trace_id" TEXT NOT NULL,
    "job" TEXT NOT NULL,
    "ok" BOOLEAN NOT NULL DEFAULT false,
    "total" INTEGER NOT NULL DEFAULT 0,
    "new_items" INTEGER NOT NULL DEFAULT 0,
    "sent" INTEGER NOT NULL DEFAULT 0,
    "failed" INTEGER NOT NULL DEFAULT 0,
    "duration_ms" INTEGER NOT NULL DEFAULT 0,
    "error" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cron_runs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "jobs_url_key" ON "jobs"("url");

-- CreateIndex
CREATE INDEX "jobs_extracted_date_idx" ON "jobs"("extracted_date");

-- CreateIndex
CREATE INDEX "jobs_posted_date_idx" ON "jobs"("posted_date");

-- CreateIndex
CREATE INDEX "jobs_industry_idx" ON "jobs"("industry");

-- CreateIndex
CREATE INDEX "jobs_seniority_idx" ON "jobs"("seniority");

-- CreateIndex
CREATE INDEX "jobs_country_idx" ON "jobs"("country");

-- CreateIndex
CREATE INDEX "jobs_region_idx" ON "jobs"("region");

-- CreateIndex
CREATE INDEX "jobs_city_idx" ON "jobs"("city");

-- CreateIndex
CREATE INDEX "jobs_company_idx" ON "jobs"("company");

-- CreateIndex
CREATE INDEX "jobs_role_category_idx" ON "jobs"("role_category");

-- CreateIndex
CREATE INDEX "jobs_role_type_idx" ON "jobs"("role_type");

-- CreateIndex
CREATE INDEX "jobs_experience_years_idx" ON "jobs"("experience_years");

-- CreateIndex
CREATE INDEX "jobs_salary_min_idx" ON "jobs"("salary_min");

-- CreateIndex
CREATE INDEX "jobs_extracted_date_industry_idx" ON "jobs"("extracted_date", "industry");

-- CreateIndex
CREATE INDEX "jobs_extracted_date_seniority_idx" ON "jobs"("extracted_date", "seniority");

-- CreateIndex
CREATE INDEX "jobs_keywords_idx" ON "jobs" USING GIN ("keywords");

-- CreateIndex
CREATE INDEX "jobs_certificates_idx" ON "jobs" USING GIN ("certificates");

-- CreateIndex
CREATE INDEX "jobs_software_idx" ON "jobs" USING GIN ("software");

-- CreateIndex
CREATE INDEX "jobs_programming_skills_idx" ON "jobs" USING GIN ("programming_skills");

-- CreateIndex
CREATE INDEX "jobs_academic_degrees_idx" ON "jobs" USING GIN ("academic_degrees");

-- CreateIndex
CREATE INDEX "jobs_title_trgm_idx" ON "jobs" USING GIN ("title" gin_trgm_ops);

-- CreateIndex
CREATE INDEX "jobs_company_trgm_idx" ON "jobs" USING GIN ("company" gin_trgm_ops);

-- CreateIndex
CREATE INDEX "jobs_location_trgm_idx" ON "jobs" USING GIN ("location" gin_trgm_ops);

-- CreateIndex
CREATE INDEX "jobs_description_trgm_idx" ON "jobs" USING GIN ("description" gin_trgm_ops);

-- CreateIndex
CREATE INDEX "sent_urls_namespace_expires_at_idx" ON "sent_urls"("namespace", "expires_at");

-- CreateIndex
CREATE UNIQUE INDEX "sent_urls_namespace_url_key" ON "sent_urls"("namespace", "url");

-- CreateIndex
CREATE INDEX "cron_runs_job_created_at_idx" ON "cron_runs"("job", "created_at");
