import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/format";
import { htmlToPlainText } from "@/lib/sanitize";
import type { BlogDTO } from "@/types";

export function BlogCard({
  blog,
  className,
  featured = false,
}: {
  blog: BlogDTO;
  className?: string;
  featured?: boolean;
}) {
  return (
    <Card
      className={cn(
        // Mobile: compact horizontal row (image left, copy right) to fit more
        // cards per screen. sm+: classic vertical card with a top banner image.
        "group relative flex h-full flex-row overflow-hidden p-0 transition-shadow hover:shadow-lg sm:flex-col",
        className,
      )}
    >
      <div className="relative w-28 shrink-0 self-stretch overflow-hidden bg-brand sm:aspect-[16/9] sm:w-full sm:self-auto">
        {blog.featuredImage ? (
          <Image
            src={blog.featuredImage}
            alt={blog.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 7rem"
            className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(120%_120%_at_100%_0%,oklch(0.46_0.11_258),oklch(0.26_0.07_258))]"
          />
        )}
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <h3
          className={cn(
            "font-heading font-semibold leading-snug text-foreground",
            featured ? "text-base sm:text-xl" : "text-base sm:text-lg",
          )}
        >
          <Link
            href={`/blogs/${blog.slug}`}
            className="line-clamp-1 after:absolute after:inset-0 sm:line-clamp-none"
          >
            {blog.title}
          </Link>
        </h3>
        {(blog.metaDescription ?? blog.introduction) && (
          <p className="mt-2 line-clamp-1 text-sm text-muted-foreground">
            {blog.metaDescription ?? htmlToPlainText(blog.introduction)}
          </p>
        )}
        <div className="mt-auto flex items-center justify-between gap-3 pt-4 text-xs text-muted-foreground">
          <span>{formatDate(blog.publishedAt)}</span>
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-accent-orange transition-transform group-hover:translate-x-0.5">
            Read more <ArrowRight className="size-4" aria-hidden="true" />
          </span>
        </div>
      </div>

      {/* Mobile-only: subtle fade along the bottom edge for a little depth. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-brand/15 to-transparent sm:hidden"
      />
    </Card>
  );
}
