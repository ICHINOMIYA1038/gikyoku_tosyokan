/*
  Warnings:

  - You are about to drop the `Access` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ChildComment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ParentComment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Access" DROP CONSTRAINT "Access_postId_fkey";

-- DropForeignKey
ALTER TABLE "ChildComment" DROP CONSTRAINT "ChildComment_parentCommentId_fkey";

-- DropForeignKey
ALTER TABLE "ParentComment" DROP CONSTRAINT "ParentComment_post_id_fkey";

-- DropTable
DROP TABLE "Access";

-- DropTable
DROP TABLE "ChildComment";

-- DropTable
DROP TABLE "ParentComment";
