-- Remove blog category functionality (schema caught up with commit bb53fdc,
-- which dropped the feature from code but never generated a migration).

-- DropForeignKey
ALTER TABLE "blogs" DROP CONSTRAINT "blogs_categoryId_fkey";

-- DropIndex
DROP INDEX "blogs_categoryId_idx";

-- AlterTable
ALTER TABLE "blogs" DROP COLUMN "categoryId";

-- DropTable
DROP TABLE "blog_categories";
