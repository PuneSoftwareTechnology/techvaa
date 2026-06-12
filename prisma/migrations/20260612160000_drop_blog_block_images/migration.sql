-- Blog content blocks no longer carry a per-block image; the article and
-- card now show only `featuredImage`. Drop the three unused columns.

ALTER TABLE "blogs" DROP COLUMN "primaryImage";
ALTER TABLE "blogs" DROP COLUMN "secondaryImage";
ALTER TABLE "blogs" DROP COLUMN "tertiaryImage";
