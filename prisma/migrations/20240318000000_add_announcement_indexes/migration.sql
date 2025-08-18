-- CreateIndex
CREATE INDEX "Announcement_createdAt_idx" ON "Announcement"("createdAt" DESC);

-- CreateIndex
CREATE INDEX "Announcement_performanceDate_idx" ON "Announcement"("performanceDate");

-- CreateIndex  
CREATE INDEX "Announcement_views_idx" ON "Announcement"("views" DESC);