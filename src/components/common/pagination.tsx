import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Page numbers to render: always the first and last page plus a window around
 * the current one, with `null` marking a gap (rendered as an ellipsis).
 */
function pageItems(page: number, pageCount: number): (number | null)[] {
  const pages = new Set([1, pageCount, page - 1, page, page + 1]);
  const sorted = [...pages]
    .filter((p) => p >= 1 && p <= pageCount)
    .sort((a, b) => a - b);

  const items: (number | null)[] = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) items.push(null);
    items.push(p);
  });
  return items;
}

/**
 * Server-rendered pagination built from plain links, so every page is
 * crawlable and works without JavaScript. `hrefFor` builds the URL for a page.
 */
export function Pagination({
  page,
  pageCount,
  hrefFor,
  className,
}: {
  page: number;
  pageCount: number;
  hrefFor: (page: number) => string;
  className?: string;
}) {
  if (pageCount <= 1) return null;

  const navClass = buttonVariants({ variant: "outline", size: "lg" });
  const disabledClass = "pointer-events-none opacity-50";

  return (
    <nav aria-label="Pagination" className={cn("flex justify-center", className)}>
      <ul className="flex flex-wrap items-center gap-1.5">
        <li>
          {page > 1 ? (
            <Link href={hrefFor(page - 1)} rel="prev" className={navClass}>
              <ChevronLeft aria-hidden="true" />
              <span className="hidden sm:inline">Previous</span>
            </Link>
          ) : (
            <span aria-disabled="true" className={cn(navClass, disabledClass)}>
              <ChevronLeft aria-hidden="true" />
              <span className="hidden sm:inline">Previous</span>
            </span>
          )}
        </li>

        {pageItems(page, pageCount).map((p, i) =>
          p === null ? (
            <li key={`gap-${i}`} aria-hidden="true" className="px-1 text-muted-foreground">
              …
            </li>
          ) : (
            <li key={p}>
              <Link
                href={hrefFor(p)}
                aria-label={`Page ${p}`}
                aria-current={p === page ? "page" : undefined}
                className={cn(
                  buttonVariants({
                    variant: p === page ? "brand" : "outline",
                    size: "icon-lg",
                  }),
                  p === page && "pointer-events-none"
                )}
              >
                {p}
              </Link>
            </li>
          )
        )}

        <li>
          {page < pageCount ? (
            <Link href={hrefFor(page + 1)} rel="next" className={navClass}>
              <span className="hidden sm:inline">Next</span>
              <ChevronRight aria-hidden="true" />
            </Link>
          ) : (
            <span aria-disabled="true" className={cn(navClass, disabledClass)}>
              <span className="hidden sm:inline">Next</span>
              <ChevronRight aria-hidden="true" />
            </span>
          )}
        </li>
      </ul>
    </nav>
  );
}
