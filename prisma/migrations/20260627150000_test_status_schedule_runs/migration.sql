-- Feed: test/send status
ALTER TABLE "feeds"
  ADD COLUMN "last_status" TEXT,
  ADD COLUMN "last_tested_at" TIMESTAMP(3),
  ADD COLUMN "last_error" TEXT;

-- NotificationChannel: connection-test status
ALTER TABLE "notification_channels"
  ADD COLUMN "last_status" TEXT,
  ADD COLUMN "last_tested_at" TIMESTAMP(3),
  ADD COLUMN "last_error" TEXT;

-- Schedule: last run status
ALTER TABLE "schedules"
  ADD COLUMN "last_status" TEXT,
  ADD COLUMN "last_error" TEXT;

-- Schedule run history
CREATE TABLE "schedule_runs" (
    "id" UUID NOT NULL,
    "schedule_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "job" TEXT NOT NULL,
    "ok" BOOLEAN NOT NULL DEFAULT false,
    "summary" TEXT,
    "error" TEXT,
    "duration_ms" INTEGER NOT NULL DEFAULT 0,
    "trigger" TEXT NOT NULL DEFAULT 'manual',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "schedule_runs_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "schedule_runs_schedule_id_created_at_idx" ON "schedule_runs"("schedule_id", "created_at");

ALTER TABLE "schedule_runs" ADD CONSTRAINT "schedule_runs_schedule_id_fkey" FOREIGN KEY ("schedule_id") REFERENCES "schedules"("id") ON DELETE CASCADE ON UPDATE CASCADE;
