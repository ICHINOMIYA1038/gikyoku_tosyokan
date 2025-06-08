-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "contentMarkdown" TEXT,
ADD COLUMN     "image_url" TEXT;

-- AlterTable
ALTER TABLE "_PostCategory" ADD CONSTRAINT "_PostCategory_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_PostCategory_AB_unique";
