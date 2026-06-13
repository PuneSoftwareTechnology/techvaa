import "server-only";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";
import {
  errorJson,
  guardAdmin,
  json,
  LEAD_STATUSES,
  noContent,
  preflight,
} from "@/lib/api/rest";

type Ctx = { params: Promise<{ id: string }> };

export async function OPTIONS(req: NextRequest) {
  return preflight(req);
}

/** GET /api/course-enquiries/:id */
export async function GET(req: NextRequest, { params }: Ctx) {
  const denied = guardAdmin(req);
  if (denied) return denied;

  const { id } = await params;
  const enquiry = await prisma.courseEnquiry.findUnique({ where: { id } });
  if (!enquiry) return errorJson("Enquiry not found", 404, req);
  return json(enquiry, req);
}

/** PATCH /api/course-enquiries/:id — status updates only. */
export async function PATCH(req: NextRequest, { params }: Ctx) {
  const denied = guardAdmin(req);
  if (denied) return denied;

  const { id } = await params;
  const body = (await req.json().catch(() => null)) as { status?: string } | null;
  const status = body?.status;
  if (!status || !LEAD_STATUSES.has(status)) {
    return errorJson("Invalid or missing status", 400, req);
  }
  try {
    const updated = await prisma.courseEnquiry.update({
      where: { id },
      data: { status: status as Prisma.CourseEnquiryUpdateInput["status"] },
    });
    return json(updated, req);
  } catch {
    return errorJson("Enquiry not found", 404, req);
  }
}

/** DELETE /api/course-enquiries/:id */
export async function DELETE(req: NextRequest, { params }: Ctx) {
  const denied = guardAdmin(req);
  if (denied) return denied;

  const { id } = await params;
  try {
    await prisma.courseEnquiry.delete({ where: { id } });
    return noContent(req);
  } catch {
    return errorJson("Enquiry not found", 404, req);
  }
}
