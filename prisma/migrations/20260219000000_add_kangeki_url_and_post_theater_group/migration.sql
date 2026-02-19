-- AlterTable
ALTER TABLE "Post" ADD COLUMN "kangeki_url" TEXT;

-- CreateTable
CREATE TABLE "PostTheaterGroup" (
    "id" SERIAL NOT NULL,
    "postId" INTEGER NOT NULL,
    "theaterGroupId" INTEGER NOT NULL,

    CONSTRAINT "PostTheaterGroup_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PostTheaterGroup_postId_idx" ON "PostTheaterGroup"("postId");

-- CreateIndex
CREATE INDEX "PostTheaterGroup_theaterGroupId_idx" ON "PostTheaterGroup"("theaterGroupId");

-- CreateIndex
CREATE UNIQUE INDEX "PostTheaterGroup_postId_theaterGroupId_key" ON "PostTheaterGroup"("postId", "theaterGroupId");

-- AddForeignKey
ALTER TABLE "PostTheaterGroup" ADD CONSTRAINT "PostTheaterGroup_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostTheaterGroup" ADD CONSTRAINT "PostTheaterGroup_theaterGroupId_fkey" FOREIGN KEY ("theaterGroupId") REFERENCES "TheaterGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
