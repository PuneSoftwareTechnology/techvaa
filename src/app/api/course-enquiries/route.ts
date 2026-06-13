import "server-only";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";
import {
  buildMeta,
  guardAdmin,
  json,
  LEAD_STATUSES,
  parsePagination,
  parseSort,
  preflight,
  searchOr,
} from "@/lib/api/rest";

const SORTABLE = ["createdAt", "name", "course", "status"] as const;

export async function OPTIONS(req: NextRequest) {
  return preflight(req);
}

/** GET /api/course-enquiries — paginated list for the admin. */
export async function GET(req: NextRequest) {
  const denied = guardAdmin(req);
  if (denied) return denied;

  const sp = req.nextUrl.searchParams;
  const pg = parsePagination(sp);
  const orderBy = parseSort(sp, SORTABLE, "createdAt");

  const where: Prisma.CourseEnquiryWhereInput = {};
  const status = sp.get("status");
  if (status && LEAD_STATUSES.has(status)) {
    where.status = status as Prisma.CourseEnquiryWhereInput["status"];
  }
  const or = searchOr(sp.get("search"), ["name", "phone", "course"]);
  if (or) where.OR = or as Prisma.CourseEnquiryWhereInput["OR"];

  const [total, data] = await Promise.all([
    prisma.courseEnquiry.count({ where }),
    prisma.courseEnquiry.findMany({
      where,
      orderBy: orderBy as Prisma.CourseEnquiryOrderByWithRelationInput,
      skip: pg.skip,
      take: pg.take,
    }),
  ]);

  return json({ data, meta: buildMeta(total, pg) }, req);
}
