-- Add approval workflow to Announcement
ALTER TABLE "Announcement"
  ADD COLUMN "status" TEXT NOT NULL DEFAULT 'approved',
  ADD COLUMN "rejectionReason" TEXT,
  ADD COLUMN "reviewedAt" TIMESTAMP(3);

-- Existing rows stay approved (already public). Future inserts default to pending.
ALTER TABLE "Announcement" ALTER COLUMN "status" SET DEFAULT 'pending';

CREATE INDEX "Announcement_status_idx" ON "Announcement"("status");
