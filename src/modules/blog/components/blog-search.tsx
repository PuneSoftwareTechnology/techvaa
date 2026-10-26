import Form from "next/form";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/**
 * GET search form for the blog listing. Submitting navigates to `/blogs?q=…`
 * (dropping any `page` param, so a new search starts on page 1). Works without
 * JavaScript; with it, `next/form` turns the submit into a client navigation.
 */
export function BlogSearch({ query }: { query?: string }) {
  return (
    <Form
      action="/blogs"
      scroll={false}
      role="search"
      className="flex w-full gap-2 sm:w-auto"
    >
      <div className="relative w-full sm:w-80">
        <Search
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <label htmlFor="blog-search" className="sr-only">
          Search articles
        </label>
        <Input
          // Re-mount on a new query so the field reflects the URL after
          // back/forward or "clear" navigation.
          key={query ?? ""}
          id="blog-search"
          type="search"
          name="q"
          defaultValue={query}
          placeholder="Search articles…"
          className="h-10 bg-card pr-9 pl-9 [&::-webkit-search-cancel-button]:appearance-none"
        />
        {query && (
          <Link
            href="/blogs"
            scroll={false}
            aria-label="Clear search"
            className="absolute top-1/2 right-2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground"
          >
            <X className="size-4" aria-hidden="true" />
          </Link>
        )}
      </div>
      <Button type="submit" variant="brand" className="h-10 px-4">
        Search
      </Button>
    </Form>
  );
}
