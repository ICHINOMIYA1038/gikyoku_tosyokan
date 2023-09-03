-- CreateTable
CREATE TABLE "Author" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "website" TEXT,
    "group" TEXT,
    "profile" TEXT,
    "masterpiece" TEXT,

    CONSTRAINT "Author_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "author_id" INTEGER NOT NULL,
    "man" INTEGER NOT NULL,
    "woman" INTEGER NOT NULL,
    "others" INTEGER NOT NULL,
    "totalNumber" INTEGER NOT NULL,
    "playtime" INTEGER NOT NULL,
    "synopsis" TEXT,
    "image_url" TEXT,
    "amazon_text_url" TEXT,
    "amazon_img_url" TEXT,
    "amazon_img_text_url" TEXT,
    "link_to_plot" TEXT,
    "website1" TEXT,
    "website2" TEXT,
    "website3" TEXT,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "News" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "url" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "News_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PostCategory" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_PostCategory_AB_unique" ON "_PostCategory"("A", "B");

-- CreateIndex
CREATE INDEX "_PostCategory_B_index" ON "_PostCategory"("B");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "Author"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PostCategory" ADD CONSTRAINT "_PostCategory_A_fkey" FOREIGN KEY ("A") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PostCategory" ADD CONSTRAINT "_PostCategory_B_fkey" FOREIGN KEY ("B") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
