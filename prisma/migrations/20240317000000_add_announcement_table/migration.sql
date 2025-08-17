-- CreateTable
CREATE TABLE "Announcement" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "performanceDate" TIMESTAMP(3),
    "venue" TEXT,
    "ticketPrice" TEXT,
    "contactInfo" TEXT,
    "authorName" TEXT NOT NULL DEFAULT '名無しさん',
    "ipAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "views" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Announcement_pkey" PRIMARY KEY ("id")
);