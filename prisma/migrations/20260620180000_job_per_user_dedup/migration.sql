-- DropIndex
DROP INDEX "jobs_url_key";

-- AlterTable
ALTER TABLE "jobs" DROP CONSTRAINT "jobs_pkey",
ADD COLUMN     "ext_id" TEXT,
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "jobs_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "jobs_user_id_url_key" ON "jobs"("user_id", "url");

