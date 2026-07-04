-- Add an optional photo to the tertiary blog content block, matching the
-- primary/secondary blocks. Nullable, so existing rows are unaffected (no
-- backfill needed).
ALTER TABLE "blogs" ADD COLUMN "tertiaryImage" TEXT;
