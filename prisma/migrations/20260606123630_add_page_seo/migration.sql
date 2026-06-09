-- CreateTable
CREATE TABLE "page_seo" (
    "id" TEXT NOT NULL,
    "page" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "metaTitle" TEXT NOT NULL,
    "metaDescription" TEXT NOT NULL,
    "keywords" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "canonicalUrl" TEXT,
    "ogImage" TEXT,
    "robots" "RobotsDirective" NOT NULL DEFAULT 'INDEX_FOLLOW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "page_seo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "page_seo_path_key" ON "page_seo"("path");
