ALTER TABLE "TheaterMenu"
  ADD COLUMN "relatedSlugs" TEXT[] DEFAULT ARRAY[]::TEXT[];
