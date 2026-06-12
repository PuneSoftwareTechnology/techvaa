-- Reconcile deployed DB with the committed schema. The 20260612000100 migration
-- was finalized to use `curriculum_items.sortOrder` (no createdAt) and a
-- `course_batches` table without `showOnHomepage`, but the database had been
-- provisioned from an earlier draft (column `order` + `createdAt`, plus an
-- orphan `showOnHomepage`). That drift made `orderBy: { sortOrder }` fail with
-- P2022 ColumnNotFound. Align the tables to the schema, preserving ordering data.

-- curriculum_items: `order` holds the curated section order -> rename to schema's
-- `sortOrder`; drop the unmodeled `createdAt`.
ALTER TABLE "curriculum_items" RENAME COLUMN "order" TO "sortOrder";
ALTER TABLE "curriculum_items" ALTER COLUMN "sortOrder" SET DEFAULT 0;
ALTER TABLE "curriculum_items" DROP COLUMN IF EXISTS "createdAt";

-- course_batches: drop the unmodeled `showOnHomepage` orphan column.
ALTER TABLE "course_batches" DROP COLUMN IF EXISTS "showOnHomepage";
