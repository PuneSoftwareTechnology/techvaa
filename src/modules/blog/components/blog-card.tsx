import { ArrowRight } from "lucide-react";
import { MediaCard } from "@/components/common/media-card";
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
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-accent-orange transition-transform group-hover:translate-x-0.5">
            Read more <ArrowRight className="size-4" aria-hidden="true" />
          </span>
        </div>
      }
    />
  );
}
