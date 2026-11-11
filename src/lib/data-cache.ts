import "server-only";
import { cache } from "react";
import { unstable_cache } from "next/cache";

/**
 * Cross-request cache for public-site DB reads.
 *
 * Pages stay dynamically rendered (see the note on the home page for why
 * page-level ISR is unsafe on Amplify's multi-instance hosting), but the
 * database round-trips behind them — the slow part (Neon is in another
 * region) — are cached in each server instance for DATA_TTL seconds.
 *
 * Why this doesn't bring back the "stale snapshot" problem: pages are
 * force-dynamic, so nothing is prerendered into the build. A fresh/cold
 * instance therefore starts with an EMPTY data cache and always reads live
 * data; the worst case anywhere is data DATA_TTL seconds old.
 *
 * The admin's POST /api/revalidate expires DATA_TAG immediately on the
 * instance that receives it; other instances catch up within DATA_TTL.
 *
 * Every cached function must return JSON-serialisable data (DTOs already
 * convert Dates to ISO strings in repositories/mappers.ts).
 */
export const DATA_TAG = "site-data";
export const DATA_TTL = 60;

export function cached<A extends unknown[], R>(
  key: string,
  fn: (...args: A) => Promise<R>,
): (...args: A) => Promise<R> {
  // React `cache` keeps per-request dedupe on top of the cross-request cache.
  return cache(
    unstable_cache(fn, [key], { revalidate: DATA_TTL, tags: [DATA_TAG] }),
  );
}
