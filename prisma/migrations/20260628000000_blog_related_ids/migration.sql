-- Replace the blog self many-to-many (`_RelatedBlogs`) with a plain ordered
-- array of related blog ids stored directly on `blogs`.
--
-- NOTE: `_RelatedBlogs` was declared in the schema/migration history but is
-- physically absent in some environments (migration drift), so its DROP is
-- guarded with IF EXISTS to stay safe on `migrate deploy`.

-- Add the column with a default so existing rows backfill to an empty array.
ALTER TABLE "blogs" ADD COLUMN "relatedBlogIds" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

-- The Prisma schema carries no @default for the array (Prisma always sends one
-- at runtime), so drop the DB-level default once rows are backfilled. Mirrors
-- the tertiaryPoints add/drop-default migration pair.
ALTER TABLE "blogs" ALTER COLUMN "relatedBlogIds" DROP DEFAULT;

-- Retire the orphaned implicit join table.
DROP TABLE IF EXISTS "_RelatedBlogs";
