-- CreateTable
CREATE TABLE "TomoshibiScene" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TomoshibiScene_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TomoshibiScene_userId_updatedAt_idx" ON "TomoshibiScene"("userId", "updatedAt" DESC);

-- AddForeignKey
ALTER TABLE "TomoshibiScene" ADD CONSTRAINT "TomoshibiScene_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
