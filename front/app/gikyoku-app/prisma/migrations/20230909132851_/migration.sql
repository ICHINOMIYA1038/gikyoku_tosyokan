-- CreateTable
CREATE TABLE "Access" (
    "id" SERIAL NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "postId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Access_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Access_ipAddress_postId_date_key" ON "Access"("ipAddress", "postId", "date");

-- AddForeignKey
ALTER TABLE "Access" ADD CONSTRAINT "Access_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
