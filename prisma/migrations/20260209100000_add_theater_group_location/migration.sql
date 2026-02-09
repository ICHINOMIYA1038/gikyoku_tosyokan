-- AlterTable
ALTER TABLE "TheaterGroup" ADD COLUMN "prefecture" TEXT;
ALTER TABLE "TheaterGroup" ADD COLUMN "region" "Region";

-- CreateIndex
CREATE INDEX "TheaterGroup_prefecture_idx" ON "TheaterGroup"("prefecture");
CREATE INDEX "TheaterGroup_region_idx" ON "TheaterGroup"("region");
