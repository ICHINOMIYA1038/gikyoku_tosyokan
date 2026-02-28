-- AlterTable
ALTER TABLE "Announcement" ADD COLUMN "postId" INTEGER;
ALTER TABLE "Announcement" ADD COLUMN "theaterGroupName" TEXT;
ALTER TABLE "Announcement" ADD COLUMN "scriptTitle" TEXT;

-- CreateIndex
CREATE INDEX "Announcement_postId_idx" ON "Announcement"("postId");

-- AddForeignKey
ALTER TABLE "Announcement" ADD CONSTRAINT "Announcement_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;
