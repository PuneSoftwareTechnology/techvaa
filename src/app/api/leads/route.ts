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

const SORTABLE = ["createdAt", "name", "status"] as const;

export async function OPTIONS(req: NextRequest) {
  return preflight(req);
}

/** GET /api/leads — paginated list for the admin (search, status filter, sort). */
export async function GET(req: NextRequest) {
  const denied = guardAdmin(req);
  if (denied) return denied;

  const sp = req.nextUrl.searchParams;
  const pg = parsePagination(sp);
  const orderBy = parseSort(sp, SORTABLE, "createdAt");

  const where: Prisma.LeadWhereInput = {};
  const status = sp.get("status");
  if (status && LEAD_STATUSES.has(status)) {
    where.status = status as Prisma.LeadWhereInput["status"];
  }
  const or = searchOr(sp.get("search"), ["name", "email", "phone"]);
  if (or) where.OR = or as Prisma.LeadWhereInput["OR"];

  const [total, data] = await Promise.all([
    prisma.lead.count({ where }),
    prisma.lead.findMany({
      where,
      orderBy: orderBy as Prisma.LeadOrderByWithRelationInput,
      skip: pg.skip,
      take: pg.take,
    }),
  ]);

  return json({ data, meta: buildMeta(total, pg) }, req);
}
