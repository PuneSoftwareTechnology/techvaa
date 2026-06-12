-- CreateEnum
CREATE TYPE "BatchStatus" AS ENUM ('ENROLLMENT_OPEN', 'LIMITED_SEATS', 'FILLING_FAST');

-- AlterTable
ALTER TABLE "course_batches" ADD COLUMN     "status" "BatchStatus" NOT NULL DEFAULT 'ENROLLMENT_OPEN',
ADD COLUMN     "timing" TEXT;
