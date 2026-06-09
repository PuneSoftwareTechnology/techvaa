-- OPTIONAL: fuzzy / substring search acceleration via pg_trgm.
--
-- These objects are intentionally NOT part of a Prisma-tracked migration,
-- because Prisma does not model trigram GIN indexes in schema.prisma. If they
-- lived in a tracked migration, a later `prisma migrate dev` would diff them
-- against the schema (which doesn't declare them) and generate a DROP.
--
-- Apply manually against production/staging once, e.g.:
--   psql "$DATABASE" -f prisma/optional/search-indexes.sql
--
-- They speed up case-insensitive ILIKE '%term%' lookups used by admin search
-- and the public site search. (Btree indexes in the main migration already
-- cover equality, prefix, and filtered/sorted queries.)
--
-- If you would rather have Prisma own these, model them in schema.prisma with
-- the `postgresqlExtensions` setup instead:
--   datasource db { extensions = [pgTrgm] }   // + previewFeatures if required
--   @@index([title(ops: raw("gin_trgm_ops"))], type: Gin)

CREATE EXTENSION IF NOT EXISTS "pg_trgm";

CREATE INDEX IF NOT EXISTS "courses_title_trgm_idx" ON "courses" USING GIN ("title" gin_trgm_ops);
CREATE INDEX IF NOT EXISTS "blogs_title_trgm_idx"   ON "blogs"   USING GIN ("title" gin_trgm_ops);
CREATE INDEX IF NOT EXISTS "blogs_content_trgm_idx" ON "blogs"   USING GIN ("content" gin_trgm_ops);
