CREATE TABLE "RevenueCatEvent" (
  "id" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "eventCreated" TIMESTAMP(3) NOT NULL,
  "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "RevenueCatEvent_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "RevenueCatEvent_type_idx" ON "RevenueCatEvent"("type");
CREATE INDEX "RevenueCatEvent_receivedAt_idx" ON "RevenueCatEvent"("receivedAt" DESC);
