-- Blog "related" links become many-to-many:
--   * relatedCourse (single FK) → relatedCourses (M2M, _BlogRelatedCourses)
--   * new curated relatedBlogs self M2M (_RelatedBlogs)

-- CreateTable: _BlogRelatedCourses (implicit M2M; A → blogs, B → courses)
CREATE TABLE "_BlogRelatedCourses" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_BlogRelatedCourses_AB_pkey" PRIMARY KEY ("A","B")
);

CREATE INDEX "_BlogRelatedCourses_B_index" ON "_BlogRelatedCourses"("B");

ALTER TABLE "_BlogRelatedCourses" ADD CONSTRAINT "_BlogRelatedCourses_A_fkey" FOREIGN KEY ("A") REFERENCES "blogs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "_BlogRelatedCourses" ADD CONSTRAINT "_BlogRelatedCourses_B_fkey" FOREIGN KEY ("B") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Preserve existing single-course links into the new join table.
INSERT INTO "_BlogRelatedCourses" ("A", "B")
SELECT "id", "relatedCourseId" FROM "blogs" WHERE "relatedCourseId" IS NOT NULL;

-- CreateTable: _RelatedBlogs (implicit self M2M; A and B → blogs)
CREATE TABLE "_RelatedBlogs" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_RelatedBlogs_AB_pkey" PRIMARY KEY ("A","B")
);

CREATE INDEX "_RelatedBlogs_B_index" ON "_RelatedBlogs"("B");

ALTER TABLE "_RelatedBlogs" ADD CONSTRAINT "_RelatedBlogs_A_fkey" FOREIGN KEY ("A") REFERENCES "blogs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "_RelatedBlogs" ADD CONSTRAINT "_RelatedBlogs_B_fkey" FOREIGN KEY ("B") REFERENCES "blogs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Drop the old single-course FK, index and column.
ALTER TABLE "blogs" DROP CONSTRAINT "blogs_relatedCourseId_fkey";
DROP INDEX "blogs_relatedCourseId_idx";
ALTER TABLE "blogs" DROP COLUMN "relatedCourseId";
