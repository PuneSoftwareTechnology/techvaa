-- CreateTable: course_enquiries --------------------------------------------
-- "Enroll Now" captures from the public site's upcoming-batches table. Reuses
-- the existing "LeadStatus" enum so admins triage enquiries with one lifecycle.
CREATE TABLE "course_enquiries" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "course" TEXT NOT NULL,
    "message" TEXT,
    "status" "LeadStatus" NOT NULL DEFAULT 'NEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "course_enquiries_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "course_enquiries_status_idx" ON "course_enquiries"("status");
CREATE INDEX "course_enquiries_createdAt_idx" ON "course_enquiries"("createdAt");
