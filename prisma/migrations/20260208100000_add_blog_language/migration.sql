-- AlterTable
ALTER TABLE "BlogPost" ADD COLUMN "language" TEXT NOT NULL DEFAULT 'ja';

-- CreateIndex
CREATE INDEX "BlogPost_language_idx" ON "BlogPost"("language");
