-- DropForeignKey
ALTER TABLE "goat_configs" DROP CONSTRAINT "goat_configs_user_id_fkey";

-- DropTable
DROP TABLE "goat_configs";

-- CreateTable
CREATE TABLE "filter_sets" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "filter_sets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "filter_conditions" (
    "id" UUID NOT NULL,
    "filter_set_id" UUID NOT NULL,
    "position" INTEGER NOT NULL,
    "field" TEXT NOT NULL,
    "op" TEXT NOT NULL DEFAULT 'is',
    "value" TEXT NOT NULL,
    "connector" TEXT NOT NULL DEFAULT 'AND',

    CONSTRAINT "filter_conditions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "filter_sets_user_id_idx" ON "filter_sets"("user_id");

-- CreateIndex
CREATE INDEX "filter_conditions_filter_set_id_position_idx" ON "filter_conditions"("filter_set_id", "position");

-- AddForeignKey
ALTER TABLE "filter_sets" ADD CONSTRAINT "filter_sets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "filter_conditions" ADD CONSTRAINT "filter_conditions_filter_set_id_fkey" FOREIGN KEY ("filter_set_id") REFERENCES "filter_sets"("id") ON DELETE CASCADE ON UPDATE CASCADE;


-- Rename the 2nd Telegram channel kind: goat -> filtered
UPDATE "notification_channels" SET "kind" = 'filtered' WHERE "kind" = 'goat';
