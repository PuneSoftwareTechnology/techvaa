-- About the Trainer section for courses.
-- Adds a heading + long-form (HTML) description shown after the curriculum.
--
-- Hand-authored to match prisma/schema.prisma (the repo authors migrations by
-- hand; `prisma migrate deploy` applies this verbatim and records it).

ALTER TABLE "courses" ADD COLUMN "trainerHeading" TEXT;
ALTER TABLE "courses" ADD COLUMN "trainerDescription" TEXT;
