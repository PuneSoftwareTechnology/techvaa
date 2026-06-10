-- Course content overhaul.
-- Adds bullet-point array fields (intro / modules / prerequisites) and a self
-- many-to-many "related courses" relation. Drops the legacy shortDescription,
-- duration and level fields (and the now-unused CourseLevel enum).
--
-- Hand-authored to match prisma/schema.prisma (the repo authors migrations by
-- hand; `prisma migrate deploy` applies this verbatim and records it).

-- AlterTable: courses — add content arrays
ALTER TABLE "courses" ADD COLUMN "intro" TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "courses" ADD COLUMN "modules" TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "courses" ADD COLUMN "prerequisites" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- DropIndex + drop legacy columns
DROP INDEX "courses_level_idx";
ALTER TABLE "courses" DROP COLUMN "shortDescription";
ALTER TABLE "courses" DROP COLUMN "duration";
ALTER TABLE "courses" DROP COLUMN "level";

-- DropEnum (CourseLevel is no longer referenced by any column)
DROP TYPE "CourseLevel";

-- CreateTable: _RelatedCourses (implicit self many-to-many join table)
CREATE TABLE "_RelatedCourses" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_RelatedCourses_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_RelatedCourses_B_index" ON "_RelatedCourses"("B");

-- AddForeignKey
ALTER TABLE "_RelatedCourses" ADD CONSTRAINT "_RelatedCourses_A_fkey" FOREIGN KEY ("A") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RelatedCourses" ADD CONSTRAINT "_RelatedCourses_B_fkey" FOREIGN KEY ("B") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
