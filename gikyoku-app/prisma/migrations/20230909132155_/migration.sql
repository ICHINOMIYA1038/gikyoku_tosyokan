/*
  Warnings:

  - You are about to drop the column `ate` on the `ParentComment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ParentComment" DROP COLUMN "ate",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
