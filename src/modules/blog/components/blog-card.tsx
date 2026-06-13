import Link from "next/link";
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
        "group relative flex h-full flex-col overflow-hidden p-0 transition-shadow hover:shadow-lg",
        className
      )}
    >
      <div className="flex flex-1 flex-col p-5">
        <h3
          className={cn(
            "font-heading font-semibold leading-snug text-foreground",
            featured ? "text-xl" : "text-lg"
          )}
        >
          <Link href={`/blog/${blog.slug}`} className="after:absolute after:inset-0">
            {blog.title}
          </Link>
        </h3>
        {(blog.metaDescription ?? blog.introduction) && (
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
            {blog.metaDescription ?? htmlToPlainText(blog.introduction)}
          </p>
        )}
        <div className="mt-4 flex items-center justify-between pt-2 text-xs text-muted-foreground">
          <span>{formatDate(blog.publishedAt)}</span>
        </div>
        <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-accent-orange transition-transform group-hover:translate-x-0.5">
          Read more <ArrowRight className="size-4" aria-hidden="true" />
        </span>
      </div>
    </Card>
  );
}
