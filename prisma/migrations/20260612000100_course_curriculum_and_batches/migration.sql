-- Overhaul course content: drop the bullet-point arrays (intro/modules/
-- prerequisites), restore shortDescription + duration, and add relational
-- Key Curriculum (curriculum_items) and upcoming batches (course_batches).

-- AlterTable
ALTER TABLE "courses" DROP COLUMN "intro",
DROP COLUMN "modules",
DROP COLUMN "prerequisites",
ADD COLUMN     "duration" TEXT,
ADD COLUMN     "shortDescription" TEXT;

-- CreateTable
CREATE TABLE "curriculum_items" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "heading" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "curriculum_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course_batches" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "duration" TEXT NOT NULL,
    "mode" TEXT DEFAULT 'Live Online',
    "isOpen" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "course_batches_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "curriculum_items_courseId_sortOrder_idx" ON "curriculum_items"("courseId", "sortOrder");

-- CreateIndex
CREATE INDEX "course_batches_courseId_startDate_idx" ON "course_batches"("courseId", "startDate");

-- AddForeignKey
ALTER TABLE "curriculum_items" ADD CONSTRAINT "curriculum_items_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_batches" ADD CONSTRAINT "course_batches_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
