import "server-only";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";
import {
  errorJson,
  json,
  LEAD_STATUSES,
  noContent,
  preflight,
} from "@/lib/api/rest";

type Ctx = { params: Promise<{ id: string }> };

export async function OPTIONS(req: NextRequest) {
  return preflight(req);
}

/** GET /api/leads/:id */
export async function GET(req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const lead = await prisma.lead.findUnique({ where: { id } });
  if (!lead) return errorJson("Lead not found", 404, req);
  return json(lead, req);
}

/** PATCH /api/leads/:id — status updates only. */
export async function PATCH(req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const body = (await req.json().catch(() => null)) as { status?: string } | null;
  const status = body?.status;
  if (!status || !LEAD_STATUSES.has(status)) {
    return errorJson("Invalid or missing status", 400, req);
  }
  try {
    const updated = await prisma.lead.update({
      where: { id },
      data: { status: status as Prisma.LeadUpdateInput["status"] },
    });
    return json(updated, req);
  } catch {
    return errorJson("Lead not found", 404, req);
  }
}

/** DELETE /api/leads/:id */
export async function DELETE(req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  try {
    await prisma.lead.delete({ where: { id } });
    return noContent(req);
  } catch {
    return errorJson("Lead not found", 404, req);
  }
}
