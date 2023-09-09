-- CreateTable
CREATE TABLE "ParentComment" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "deleted" BOOLEAN NOT NULL,
    "post_id" INTEGER NOT NULL,

    CONSTRAINT "ParentComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChildComment" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "deleted" BOOLEAN NOT NULL,
    "parentCommentId" INTEGER NOT NULL,

    CONSTRAINT "ChildComment_pkey" PRIMARY KEY ("id")
);

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
ALTER TABLE "ParentComment" ADD CONSTRAINT "ParentComment_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChildComment" ADD CONSTRAINT "ChildComment_parentCommentId_fkey" FOREIGN KEY ("parentCommentId") REFERENCES "ParentComment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Access" ADD CONSTRAINT "Access_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
