-- Add optional per-section photos to blogs. Each content block can carry an
-- image shown between its title and intro. Nullable, so existing rows are
-- unaffected (no backfill needed).
ALTER TABLE "blogs" ADD COLUMN "primaryImage" TEXT;
ALTER TABLE "blogs" ADD COLUMN "secondaryImage" TEXT;
