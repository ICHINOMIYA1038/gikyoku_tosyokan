-- AlterTable
ALTER TABLE "News" ALTER COLUMN "url" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "ISBN_13" TEXT,
ADD COLUMN     "buy_link" TEXT,
ALTER COLUMN "man" DROP NOT NULL,
ALTER COLUMN "woman" DROP NOT NULL,
ALTER COLUMN "others" DROP NOT NULL,
ALTER COLUMN "totalNumber" DROP NOT NULL,
ALTER COLUMN "playtime" DROP NOT NULL;
