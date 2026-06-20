-- Rename the CONTENT_MANAGER role to MARKETING_EXECUTIVE and drop the unused
-- SEO_MANAGER role (the SEO module was removed from the admin app).
--
-- Postgres cannot rename/remove enum values in a transaction-safe way that also
-- drops a value, so we recreate the type. Hand-authored to match
-- prisma/schema.prisma; `prisma migrate deploy` applies this verbatim.

-- Reassign any users still holding the role being removed.
UPDATE "users" SET "role" = 'CONTENT_MANAGER' WHERE "role" = 'SEO_MANAGER';

-- Recreate the enum without SEO_MANAGER and with CONTENT_MANAGER renamed.
CREATE TYPE "UserRole_new" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'MARKETING_EXECUTIVE');

ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT;

ALTER TABLE "users" ALTER COLUMN "role" TYPE "UserRole_new" USING (
  CASE "role"::text
    WHEN 'CONTENT_MANAGER' THEN 'MARKETING_EXECUTIVE'
    ELSE "role"::text
  END
)::"UserRole_new";

DROP TYPE "UserRole";
ALTER TYPE "UserRole_new" RENAME TO "UserRole";

ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'MARKETING_EXECUTIVE';
