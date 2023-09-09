-- AlterTable
ALTER TABLE "Access" ADD COLUMN     "author" TEXT NOT NULL DEFAULT '名無しさん';

-- AlterTable
ALTER TABLE "ChildComment" ADD COLUMN     "author" TEXT NOT NULL DEFAULT '名無しさん';
