/*
  Warnings:

  - You are about to drop the column `author` on the `Access` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Access" DROP COLUMN "author";

-- AlterTable
ALTER TABLE "ChildComment" ALTER COLUMN "deleted" SET DEFAULT false;

-- AlterTable
ALTER TABLE "ParentComment" ADD COLUMN     "author" TEXT NOT NULL DEFAULT '名無しさん',
ALTER COLUMN "deleted" SET DEFAULT false;
