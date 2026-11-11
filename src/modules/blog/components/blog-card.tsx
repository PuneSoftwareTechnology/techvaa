import { ArrowRight } from "lucide-react";
import { MediaCard } from "@/components/common/media-card";
import { formatDate } from "@/lib/format";
import { htmlToPlainText } from "@/lib/sanitize";
import type { BlogDTO } from "@/types";
import Link from "next/link";

export function BlogCard({
  blog,
  className,
  featured = false,
}: {
  blog: BlogDTO;
  className?: string;
  featured?: boolean;
}) {
  const subtitle =
    blog.metaDescription ??
    (blog.introduction ? htmlToPlainText(blog.introduction) : null);

  return (
    <MediaCard
      stacked
      href={`/blogs/${blog.slug}`}
      image={blog.featuredImage}
      title={blog.title}
      subtitle={subtitle}
      featured={featured}
      className={className}
      footer={
        <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
          <span>{formatDate(blog.publishedAt)}</span>
          <Link
            href={`/blogs/${blog.slug}`}
            // Every card repeats "Read Blog"; name the target so screen-reader
            // link lists can tell them apart (label starts with the visible text).
            aria-label={`Read Blog: ${blog.title}`}
            className="relative z-10 inline-flex items-center gap-1 text-sm font-semibold text-accent-orange-strong dark:text-accent-orange transition-transform hover:underline group-hover:translate-x-0.5"
          >
            Read Blog
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      }
    />
  );
}
