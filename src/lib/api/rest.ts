import "server-only";
import { NextResponse } from "next/server";
import { rateLimit, ipFromRequest } from "@/lib/rate-limit";

/** Pagination block in the admin SPA's `Paginated<T>` response shape. */
export type AdminPaginationMeta = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

/**
 * Shared helpers for the admin-facing REST API (the Techvaa admin SPA reads
 * these over HTTP). They mirror the admin's `ListParams` / `Paginated<T>` /
 * `ApiError` contract so the existing repository layer works unchanged.
 *
 * AUTH: handled in the admin repo, so route handlers only rate-limit by IP.
 */

/**
 * Gate an admin API request. Returns an error `NextResponse` to short-circuit
 * with, or `null` when the request may proceed.
 *  - Rate-limits by client IP (60 req/min) to blunt scraping/brute force.
 */
export function guardAdmin(req: Request): NextResponse | null {
  const rl = rateLimit(`api:${ipFromRequest(req)}`, {
    limit: 60,
    windowMs: 60_000,
  });
  if (!rl.ok) {
    return NextResponse.json(
      { message: "Too many requests. Please slow down." },
      { status: 429, headers: { ...corsHeaders(req), "Retry-After": String(rl.retryAfter) } }
    );
  }

  return null;
}

/** Valid `LeadStatus` values (shared by Lead and CourseEnquiry). */
export const LEAD_STATUSES = new Set([
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "CLOSED",
  "LOST",
]);

/** Permissive CORS — reflects the caller's origin so credentialed XHR works. */
export function corsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get("origin") ?? "*";
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Methods": "GET, PATCH, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    Vary: "Origin",
  };
}

/** Standard preflight response. */
export function preflight(req: Request): NextResponse {
  return new NextResponse(null, { status: 204, headers: corsHeaders(req) });
}

/** JSON success response with CORS headers attached. */
export function json(data: unknown, req: Request, status = 200): NextResponse {
  return NextResponse.json(data, { status, headers: corsHeaders(req) });
}

/** JSON error in the admin's `ApiError` shape (`{ message }`). */
export function errorJson(
  message: string,
  status: number,
  req: Request
): NextResponse {
  return NextResponse.json({ message }, { status, headers: corsHeaders(req) });
}

/** 204 No Content with CORS headers (used by DELETE). */
export function noContent(req: Request): NextResponse {
  return new NextResponse(null, { status: 204, headers: corsHeaders(req) });
}

export type Pagination = { page: number; pageSize: number; skip: number; take: number };

/** Parse `page` / `pageSize` (clamped) from the query string. */
export function parsePagination(sp: URLSearchParams): Pagination {
  const page = Math.max(1, toInt(sp.get("page"), 1));
  const pageSize = Math.min(100, Math.max(1, toInt(sp.get("pageSize"), 10)));
  return { page, pageSize, skip: (page - 1) * pageSize, take: pageSize };
}

/** Parse `sortBy` / `sortOrder`, whitelisting the column to avoid bad orderings. */
export function parseSort(
  sp: URLSearchParams,
  sortable: readonly string[],
  defaultSort: string
): { [k: string]: "asc" | "desc" } {
  const requested = sp.get("sortBy") ?? "";
  const sortBy = sortable.includes(requested) ? requested : defaultSort;
  const sortOrder = sp.get("sortOrder") === "asc" ? "asc" : "desc";
  return { [sortBy]: sortOrder };
}

/** Build the admin's pagination meta block. */
export function buildMeta(
  total: number,
  { page, pageSize }: Pagination
): AdminPaginationMeta {
  return {
    page,
    pageSize,
    total,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
}

/** Case-insensitive `contains` OR across the given string columns. */
export function searchOr(
  search: string | null,
  fields: readonly string[]
): Record<string, unknown>[] | undefined {
  const q = search?.trim();
  if (!q) return undefined;
  return fields.map((f) => ({ [f]: { contains: q, mode: "insensitive" } }));
}

function toInt(value: string | null, fallback: number): number {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback;
}
