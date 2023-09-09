-- CreateTable
CREATE TABLE "ParentComment" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "post_id" INTEGER NOT NULL,
    "author" TEXT NOT NULL DEFAULT '名無しさん',
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ParentComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChildComment" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "parentCommentId" INTEGER NOT NULL,
    "author" TEXT NOT NULL DEFAULT '名無しさん',
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChildComment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ParentComment" ADD CONSTRAINT "ParentComment_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChildComment" ADD CONSTRAINT "ChildComment_parentCommentId_fkey" FOREIGN KEY ("parentCommentId") REFERENCES "ParentComment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
