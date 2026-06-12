-- Completes the reconciliation that 20260612120000_fix_curriculum_batch_drift
-- was meant to perform. On the deployed Neon DB that migration was recorded in
-- _prisma_migrations but its SQL never actually took effect (the tables still
-- carried the pre-fix shape: curriculum_items.order + createdAt, and
-- course_batches.showOnHomepage with NO `mode` column). It was also incomplete:
-- it never ADDed course_batches.mode, assuming the earlier create-table had
-- already provided it — which it had not in the drifted DB.
--
-- The missing `mode` column was the actual cause of the cryptic runtime error
-- "WITHIN GROUP is required for ordered-set aggregate mode": Prisma selects
-- "course_batches"."mode", Postgres cannot find that column, and falls back to
-- parsing table.column as the function call mode(course_batches) — `mode` being
-- the ordered-set aggregate — which then demands a WITHIN GROUP clause.
--
-- Every statement is idempotent so this is safe whether the DB is on the
-- pre-fix shape, the partially-fixed shape, or already correct.

-- curriculum_items: `order` -> schema's `sortOrder`; drop the unmodeled createdAt.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'curriculum_items' AND column_name = 'order'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'curriculum_items' AND column_name = 'sortOrder'
  ) THEN
    ALTER TABLE "curriculum_items" RENAME COLUMN "order" TO "sortOrder";
  END IF;
END $$;

ALTER TABLE "curriculum_items" ALTER COLUMN "sortOrder" SET DEFAULT 0;
ALTER TABLE "curriculum_items" DROP COLUMN IF EXISTS "createdAt";

-- course_batches: drop the unmodeled showOnHomepage orphan; add the missing
-- `mode` column the schema models (CourseBatch.mode, default 'Live Online').
ALTER TABLE "course_batches" DROP COLUMN IF EXISTS "showOnHomepage";
ALTER TABLE "course_batches" ADD COLUMN IF NOT EXISTS "mode" TEXT DEFAULT 'Live Online';
