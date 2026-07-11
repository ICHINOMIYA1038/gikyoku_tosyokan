-- AlterTable: 拡張メタデータ列を追加
ALTER TABLE "TheaterMenu"
  ADD COLUMN "aliases" TEXT[] DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN "learningObjectives" TEXT[] DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN "ageGroup" TEXT,
  ADD COLUMN "materials" TEXT[] DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN "spaceRequirement" TEXT,
  ADD COLUMN "hasPhysicalContact" BOOLEAN,
  ADD COLUMN "sideCoaching" TEXT,
  ADD COLUMN "reflectionQuestions" TEXT[] DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN "videoUrl" TEXT,
  ADD COLUMN "credit" TEXT,
  ADD COLUMN "sourceUrl" TEXT;

-- CreateTable: TheaterMenuFavorite
CREATE TABLE "TheaterMenuFavorite" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "menuId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TheaterMenuFavorite_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "TheaterMenuFavorite_userId_menuId_key" ON "TheaterMenuFavorite"("userId", "menuId");
CREATE INDEX "TheaterMenuFavorite_userId_idx" ON "TheaterMenuFavorite"("userId");
CREATE INDEX "TheaterMenuFavorite_menuId_idx" ON "TheaterMenuFavorite"("menuId");

ALTER TABLE "TheaterMenuFavorite" ADD CONSTRAINT "TheaterMenuFavorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TheaterMenuFavorite" ADD CONSTRAINT "TheaterMenuFavorite_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "TheaterMenu"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable: LessonPlan
CREATE TABLE "LessonPlan" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LessonPlan_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "LessonPlan_userId_updatedAt_idx" ON "LessonPlan"("userId", "updatedAt" DESC);

ALTER TABLE "LessonPlan" ADD CONSTRAINT "LessonPlan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable: LessonPlanItem
CREATE TABLE "LessonPlanItem" (
    "id" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "menuId" INTEGER NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "customDuration" INTEGER,
    "notes" TEXT,

    CONSTRAINT "LessonPlanItem_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "LessonPlanItem_planId_order_idx" ON "LessonPlanItem"("planId", "order");

ALTER TABLE "LessonPlanItem" ADD CONSTRAINT "LessonPlanItem_planId_fkey" FOREIGN KEY ("planId") REFERENCES "LessonPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "LessonPlanItem" ADD CONSTRAINT "LessonPlanItem_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "TheaterMenu"("id") ON DELETE CASCADE ON UPDATE CASCADE;
