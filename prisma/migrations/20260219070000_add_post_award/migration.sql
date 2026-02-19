-- CreateTable
CREATE TABLE "PostAward" (
    "id" SERIAL NOT NULL,
    "postId" INTEGER NOT NULL,
    "awardName" TEXT NOT NULL,
    "awardYear" INTEGER NOT NULL,
    "awardType" TEXT NOT NULL DEFAULT '受賞',

    CONSTRAINT "PostAward_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PostAward_postId_idx" ON "PostAward"("postId");

-- CreateIndex
CREATE INDEX "PostAward_awardName_idx" ON "PostAward"("awardName");

-- CreateIndex
CREATE UNIQUE INDEX "PostAward_postId_awardName_awardYear_key" ON "PostAward"("postId", "awardName", "awardYear");

-- AddForeignKey
ALTER TABLE "PostAward" ADD CONSTRAINT "PostAward_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
