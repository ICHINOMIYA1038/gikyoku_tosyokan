-- CreateEnum
CREATE TYPE "UniversityType" AS ENUM ('NATIONAL', 'PUBLIC', 'PRIVATE');

-- CreateEnum
CREATE TYPE "Region" AS ENUM ('HOKKAIDO', 'TOHOKU', 'KANTO', 'CHUBU', 'KANSAI', 'CHUGOKU_SHIKOKU', 'KYUSHU_OKINAWA');

-- CreateEnum
CREATE TYPE "TheaterGroupType" AS ENUM ('STUDENT', 'INTERCOLLEGE', 'ACADEMIC', 'AMATEUR', 'PROFESSIONAL', 'YOUTH');

-- CreateTable
CREATE TABLE "University" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "universityType" "UniversityType" NOT NULL,
    "prefecture" TEXT NOT NULL,
    "region" "Region" NOT NULL,
    "website" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "University_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TheaterGroup" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "groupType" "TheaterGroupType" NOT NULL DEFAULT 'STUDENT',
    "description" TEXT,
    "memberCount" INTEGER,
    "foundedYear" INTEGER,
    "website" TEXT,
    "twitter" TEXT,
    "instagram" TEXT,
    "corich" TEXT,
    "otherLinks" TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "blogPostSlug" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TheaterGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TheaterGroupUniversity" (
    "id" SERIAL NOT NULL,
    "theaterGroupId" INTEGER NOT NULL,
    "universityId" INTEGER NOT NULL,
    "campus" TEXT,

    CONSTRAINT "TheaterGroupUniversity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "University_name_key" ON "University"("name");

-- CreateIndex
CREATE UNIQUE INDEX "University_slug_key" ON "University"("slug");

-- CreateIndex
CREATE INDEX "University_region_idx" ON "University"("region");

-- CreateIndex
CREATE INDEX "University_prefecture_idx" ON "University"("prefecture");

-- CreateIndex
CREATE INDEX "University_universityType_idx" ON "University"("universityType");

-- CreateIndex
CREATE UNIQUE INDEX "TheaterGroup_slug_key" ON "TheaterGroup"("slug");

-- CreateIndex
CREATE INDEX "TheaterGroup_groupType_idx" ON "TheaterGroup"("groupType");

-- CreateIndex
CREATE INDEX "TheaterGroup_isActive_idx" ON "TheaterGroup"("isActive");

-- CreateIndex
CREATE INDEX "TheaterGroupUniversity_theaterGroupId_idx" ON "TheaterGroupUniversity"("theaterGroupId");

-- CreateIndex
CREATE INDEX "TheaterGroupUniversity_universityId_idx" ON "TheaterGroupUniversity"("universityId");

-- CreateIndex
CREATE UNIQUE INDEX "TheaterGroupUniversity_theaterGroupId_universityId_key" ON "TheaterGroupUniversity"("theaterGroupId", "universityId");

-- AddForeignKey
ALTER TABLE "TheaterGroupUniversity" ADD CONSTRAINT "TheaterGroupUniversity_theaterGroupId_fkey" FOREIGN KEY ("theaterGroupId") REFERENCES "TheaterGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TheaterGroupUniversity" ADD CONSTRAINT "TheaterGroupUniversity_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "University"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
