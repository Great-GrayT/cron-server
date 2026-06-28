-- User: profile picture + per-page bans
ALTER TABLE "users"
  ADD COLUMN "avatar_url" TEXT,
  ADD COLUMN "avatar_data" TEXT,
  ADD COLUMN "revoked_pages" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

-- Schedule: optional cron expression
ALTER TABLE "schedules" ADD COLUMN "cron_expr" TEXT;

-- Direct messages (user<->admin, user<->user)
CREATE TABLE "messages" (
    "id" UUID NOT NULL,
    "from_user_id" UUID NOT NULL,
    "to_user_id" UUID,
    "to_admin" BOOLEAN NOT NULL DEFAULT false,
    "subject" TEXT,
    "body" TEXT NOT NULL,
    "read_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "messages_to_user_id_created_at_idx" ON "messages"("to_user_id", "created_at");
CREATE INDEX "messages_from_user_id_created_at_idx" ON "messages"("from_user_id", "created_at");
CREATE INDEX "messages_to_admin_created_at_idx" ON "messages"("to_admin", "created_at");

ALTER TABLE "messages" ADD CONSTRAINT "messages_from_user_id_fkey" FOREIGN KEY ("from_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "messages" ADD CONSTRAINT "messages_to_user_id_fkey" FOREIGN KEY ("to_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
