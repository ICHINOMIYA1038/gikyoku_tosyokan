-- Add tomoshibi Pro plan fields to User
ALTER TABLE "User"
  ADD COLUMN "tomoshibiPlan" TEXT NOT NULL DEFAULT 'free',
  ADD COLUMN "tomoshibiPlanExpiresAt" TIMESTAMP(3),
  ADD COLUMN "stripeCustomerId" TEXT,
  ADD COLUMN "stripeSubscriptionId" TEXT;

CREATE UNIQUE INDEX "User_stripeCustomerId_key" ON "User"("stripeCustomerId");
CREATE UNIQUE INDEX "User_stripeSubscriptionId_key" ON "User"("stripeSubscriptionId");
