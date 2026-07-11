-- CreateTable
CREATE TABLE "TheaterMenuCategory" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TheaterMenuCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TheaterMenu" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "imageUrl" TEXT,
    "images" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "duration" INTEGER,
    "minPeople" INTEGER,
    "maxPeople" INTEGER,
    "difficulty" INTEGER,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TheaterMenu_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TheaterMenuCategory_slug_key" ON "TheaterMenuCategory"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "TheaterMenu_slug_key" ON "TheaterMenu"("slug");

-- CreateIndex
CREATE INDEX "TheaterMenu_categoryId_idx" ON "TheaterMenu"("categoryId");

-- CreateIndex
CREATE INDEX "TheaterMenu_published_idx" ON "TheaterMenu"("published");

-- CreateIndex
CREATE INDEX "TheaterMenu_slug_idx" ON "TheaterMenu"("slug");

-- AddForeignKey
ALTER TABLE "TheaterMenu" ADD CONSTRAINT "TheaterMenu_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "TheaterMenuCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
