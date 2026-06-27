-- AlterTable: extended profile + email verification on users
ALTER TABLE "users"
  ADD COLUMN "username" TEXT,
  ADD COLUMN "first_name" TEXT,
  ADD COLUMN "last_name" TEXT,
  ADD COLUMN "phone_dial_code" TEXT,
  ADD COLUMN "phone_number" TEXT,
  ADD COLUMN "mobile_dial_code" TEXT,
  ADD COLUMN "mobile_number" TEXT,
  ADD COLUMN "speciality" TEXT,
  ADD COLUMN "country" TEXT,
  ADD COLUMN "city" TEXT,
  ADD COLUMN "email_verified" BOOLEAN NOT NULL DEFAULT false;

-- Grandfather existing accounts: they predate email verification, keep them active.
UPDATE "users" SET "email_verified" = true;

-- CreateIndex: unique username
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateTable: auth tokens (email verify + password reset)
CREATE TABLE "auth_tokens" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "type" TEXT NOT NULL,
    "token_hash" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "auth_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "auth_tokens_user_id_type_idx" ON "auth_tokens"("user_id", "type");

-- CreateIndex
CREATE INDEX "auth_tokens_token_hash_idx" ON "auth_tokens"("token_hash");

-- AddForeignKey
ALTER TABLE "auth_tokens" ADD CONSTRAINT "auth_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
