-- Replace the free-form blog `content` with a fixed templated structure:
-- an introduction, three content blocks (primary/secondary/tertiary, the last
-- carrying bullet points), and a conclusion. Also adds a homepage flag and an
-- optional related-course link.

-- AlterTable: add the new templated columns.
ALTER TABLE "blogs"
  ADD COLUMN "metaDescription" TEXT,
  ADD COLUMN "introduction"    TEXT,
  ADD COLUMN "primaryTitle"    TEXT,
  ADD COLUMN "primaryIntro"    TEXT,
  ADD COLUMN "primaryImage"    TEXT,
  ADD COLUMN "primaryText"     TEXT,
  ADD COLUMN "secondaryTitle"  TEXT,
  ADD COLUMN "secondaryIntro"  TEXT,
  ADD COLUMN "secondaryImage"  TEXT,
  ADD COLUMN "secondaryText"   TEXT,
  ADD COLUMN "tertiaryTitle"   TEXT,
  ADD COLUMN "tertiaryIntro"   TEXT,
  ADD COLUMN "tertiaryImage"   TEXT,
  ADD COLUMN "tertiaryText"    TEXT,
  ADD COLUMN "tertiaryPoints"  TEXT[] DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN "conclusion"      TEXT,
  ADD COLUMN "showOnHomepage"  BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "relatedCourseId" TEXT;

-- Backfill introduction (required) from the old free-form fields before dropping
-- them, so existing rows keep a sensible lede. metaDescription inherits excerpt.
UPDATE "blogs" SET
  "introduction"    = COALESCE(NULLIF("excerpt", ''), "content"),
  "metaDescription" = NULLIF("excerpt", '');

-- introduction is required.
ALTER TABLE "blogs" ALTER COLUMN "introduction" SET NOT NULL;

-- Drop the obsolete free-form fields.
ALTER TABLE "blogs"
  DROP COLUMN "excerpt",
  DROP COLUMN "content",
  DROP COLUMN "readingTime";

-- CreateIndex
CREATE INDEX "blogs_relatedCourseId_idx" ON "blogs"("relatedCourseId");
CREATE INDEX "blogs_showOnHomepage_idx" ON "blogs"("showOnHomepage");

-- AddForeignKey
ALTER TABLE "blogs" ADD CONSTRAINT "blogs_relatedCourseId_fkey" FOREIGN KEY ("relatedCourseId") REFERENCES "courses"("id") ON DELETE SET NULL ON UPDATE CASCADE;
