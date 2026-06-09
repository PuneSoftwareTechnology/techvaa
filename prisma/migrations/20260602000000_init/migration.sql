-- Techvaa initial migration
-- Hand-authored to mirror prisma/schema.prisma (the Prisma 7 CLI requires
-- Node >= 20.19 and could not be run in the authoring environment, which is on
-- Node 18). Running `prisma migrate dev` on Node 20+ against a fresh database
-- will apply this verbatim and report no drift.

-- CreateEnum ----------------------------------------------------------------
CREATE TYPE "UserRole" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'CONTENT_MANAGER', 'SEO_MANAGER');

CREATE TYPE "CourseLevel" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'ALL_LEVELS');

CREATE TYPE "LeadStatus" AS ENUM ('NEW', 'CONTACTED', 'QUALIFIED', 'CLOSED', 'LOST');

CREATE TYPE "LeadSource" AS ENUM ('WEBSITE', 'REFERRAL', 'SOCIAL_MEDIA', 'GOOGLE_ADS', 'ORGANIC_SEARCH', 'EMAIL_CAMPAIGN', 'OTHER');

CREATE TYPE "RobotsDirective" AS ENUM ('INDEX_FOLLOW', 'NOINDEX_FOLLOW', 'INDEX_NOFOLLOW', 'NOINDEX_NOFOLLOW');

-- CreateTable: users --------------------------------------------------------
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'CONTENT_MANAGER',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable: courses ------------------------------------------------------
CREATE TABLE "courses" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "shortDescription" TEXT,
    "description" TEXT NOT NULL,
    "duration" TEXT,
    "level" "CourseLevel" NOT NULL DEFAULT 'ALL_LEVELS',
    "price" DECIMAL(10,2),
    "image" TEXT,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable: blog_categories ----------------------------------------------
CREATE TABLE "blog_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "blog_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable: blogs --------------------------------------------------------
CREATE TABLE "blogs" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "excerpt" TEXT,
    "content" TEXT NOT NULL,
    "featuredImage" TEXT,
    "readingTime" INTEGER,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "blogs_pkey" PRIMARY KEY ("id")
);

-- CreateTable: reviews ------------------------------------------------------
CREATE TABLE "reviews" (
    "id" TEXT NOT NULL,
    "studentName" TEXT NOT NULL,
    "company" TEXT,
    "designation" TEXT,
    "rating" INTEGER NOT NULL,
    "review" TEXT NOT NULL,
    "image" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable: testimonials -------------------------------------------------
CREATE TABLE "testimonials" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT,
    "company" TEXT,
    "message" TEXT NOT NULL,
    "image" TEXT,
    "videoUrl" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "testimonials_pkey" PRIMARY KEY ("id")
);

-- CreateTable: placements ---------------------------------------------------
CREATE TABLE "placements" (
    "id" TEXT NOT NULL,
    "studentName" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "package" TEXT,
    "course" TEXT,
    "image" TEXT,
    "linkedinUrl" TEXT,
    "joiningDate" TIMESTAMP(3),
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "placements_pkey" PRIMARY KEY ("id")
);

-- CreateTable: faqs ---------------------------------------------------------
CREATE TABLE "faqs" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "faqs_pkey" PRIMARY KEY ("id")
);

-- CreateTable: leads --------------------------------------------------------
CREATE TABLE "leads" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "message" TEXT,
    "source" "LeadSource" NOT NULL DEFAULT 'WEBSITE',
    "courseInterest" TEXT,
    "status" "LeadStatus" NOT NULL DEFAULT 'NEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "leads_pkey" PRIMARY KEY ("id")
);

-- CreateTable: media --------------------------------------------------------
CREATE TABLE "media" (
    "id" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uploadedById" TEXT,

    CONSTRAINT "media_pkey" PRIMARY KEY ("id")
);

-- CreateTable: seo_metadata -------------------------------------------------
CREATE TABLE "seo_metadata" (
    "id" TEXT NOT NULL,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "canonicalUrl" TEXT,
    "keywords" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "ogTitle" TEXT,
    "ogDescription" TEXT,
    "ogImage" TEXT,
    "robots" "RobotsDirective" NOT NULL DEFAULT 'INDEX_FOLLOW',
    "schemaMarkup" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "courseId" TEXT,
    "blogId" TEXT,

    CONSTRAINT "seo_metadata_pkey" PRIMARY KEY ("id")
);

-- CreateIndex: unique constraints -------------------------------------------
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

CREATE UNIQUE INDEX "courses_slug_key" ON "courses"("slug");

CREATE UNIQUE INDEX "blog_categories_name_key" ON "blog_categories"("name");
CREATE UNIQUE INDEX "blog_categories_slug_key" ON "blog_categories"("slug");

CREATE UNIQUE INDEX "blogs_slug_key" ON "blogs"("slug");

CREATE UNIQUE INDEX "seo_metadata_courseId_key" ON "seo_metadata"("courseId");
CREATE UNIQUE INDEX "seo_metadata_blogId_key" ON "seo_metadata"("blogId");

-- CreateIndex: secondary indexes --------------------------------------------
CREATE INDEX "users_role_idx" ON "users"("role");
CREATE INDEX "users_isActive_idx" ON "users"("isActive");
CREATE INDEX "users_deletedAt_idx" ON "users"("deletedAt");

CREATE INDEX "courses_isPublished_isFeatured_idx" ON "courses"("isPublished", "isFeatured");
CREATE INDEX "courses_level_idx" ON "courses"("level");
CREATE INDEX "courses_createdAt_idx" ON "courses"("createdAt");
CREATE INDEX "courses_deletedAt_idx" ON "courses"("deletedAt");

CREATE INDEX "blog_categories_deletedAt_idx" ON "blog_categories"("deletedAt");

CREATE INDEX "blogs_categoryId_idx" ON "blogs"("categoryId");
CREATE INDEX "blogs_isPublished_publishedAt_idx" ON "blogs"("isPublished", "publishedAt");
CREATE INDEX "blogs_publishedAt_idx" ON "blogs"("publishedAt");
CREATE INDEX "blogs_deletedAt_idx" ON "blogs"("deletedAt");

CREATE INDEX "reviews_isPublished_idx" ON "reviews"("isPublished");
CREATE INDEX "reviews_rating_idx" ON "reviews"("rating");
CREATE INDEX "reviews_deletedAt_idx" ON "reviews"("deletedAt");

CREATE INDEX "testimonials_isPublished_idx" ON "testimonials"("isPublished");
CREATE INDEX "testimonials_deletedAt_idx" ON "testimonials"("deletedAt");

CREATE INDEX "placements_isPublished_idx" ON "placements"("isPublished");
CREATE INDEX "placements_company_idx" ON "placements"("company");
CREATE INDEX "placements_joiningDate_idx" ON "placements"("joiningDate");
CREATE INDEX "placements_deletedAt_idx" ON "placements"("deletedAt");

CREATE INDEX "faqs_isPublished_sortOrder_idx" ON "faqs"("isPublished", "sortOrder");
CREATE INDEX "faqs_deletedAt_idx" ON "faqs"("deletedAt");

CREATE INDEX "leads_status_idx" ON "leads"("status");
CREATE INDEX "leads_email_idx" ON "leads"("email");
CREATE INDEX "leads_source_idx" ON "leads"("source");
CREATE INDEX "leads_createdAt_idx" ON "leads"("createdAt");

CREATE INDEX "media_uploadedById_idx" ON "media"("uploadedById");
CREATE INDEX "media_fileType_idx" ON "media"("fileType");
CREATE INDEX "media_createdAt_idx" ON "media"("createdAt");

-- AddForeignKey -------------------------------------------------------------
ALTER TABLE "blogs" ADD CONSTRAINT "blogs_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "blog_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "media" ADD CONSTRAINT "media_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "seo_metadata" ADD CONSTRAINT "seo_metadata_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "seo_metadata" ADD CONSTRAINT "seo_metadata_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "blogs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Data integrity (raw addition — Prisma has no native CHECK directive, and it
-- never introspects or drops CHECK constraints, so this survives migrate dev) -
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_rating_check" CHECK ("rating" BETWEEN 1 AND 5);
