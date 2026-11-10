-- AlterTable
ALTER TABLE "placements" ADD COLUMN     "showOnCoursePage" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "placements_showOnCoursePage_idx" ON "placements"("showOnCoursePage");

-- CreateTable
CREATE TABLE "_CoursePlacements" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CoursePlacements_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_CoursePlacements_B_index" ON "_CoursePlacements"("B");

-- AddForeignKey
ALTER TABLE "_CoursePlacements" ADD CONSTRAINT "_CoursePlacements_A_fkey" FOREIGN KEY ("A") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CoursePlacements" ADD CONSTRAINT "_CoursePlacements_B_fkey" FOREIGN KEY ("B") REFERENCES "placements"("id") ON DELETE CASCADE ON UPDATE CASCADE;
