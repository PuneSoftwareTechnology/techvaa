-- AlterTable
ALTER TABLE "faqs" ADD COLUMN     "showOnHomepage" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "faqs_showOnHomepage_idx" ON "faqs"("showOnHomepage");

-- CreateTable
CREATE TABLE "_CourseFaqs" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CourseFaqs_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_CourseFaqs_B_index" ON "_CourseFaqs"("B");

-- AddForeignKey
ALTER TABLE "_CourseFaqs" ADD CONSTRAINT "_CourseFaqs_A_fkey" FOREIGN KEY ("A") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CourseFaqs" ADD CONSTRAINT "_CourseFaqs_B_fkey" FOREIGN KEY ("B") REFERENCES "faqs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
