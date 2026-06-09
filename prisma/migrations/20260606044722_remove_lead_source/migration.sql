/*
  Warnings:

  - You are about to drop the column `source` on the `leads` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "leads_source_idx";

-- AlterTable
ALTER TABLE "leads" DROP COLUMN "source";

-- DropEnum
DROP TYPE "LeadSource";
