"use client";

import { useRouter, usePathname } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { BlogCategoryDTO } from "@/types";

/**
 * Category filter. Updates the URL (?category=slug) so the server re-renders
 * the filtered list — keeps the page SEO-friendly and shareable.
 */
export function BlogFilter({
  categories,
  active,
}: {
  categories: BlogCategoryDTO[];
  active?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const onChange = (value: string) => {
    const params = new URLSearchParams();
    if (value && value !== "all") params.set("category", value);
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  return (
    <div className="flex items-center gap-3">
      <label htmlFor="blog-sort" className="text-sm font-medium text-muted-foreground">
        Sort by
      </label>
      <Select value={active ?? "all"} onValueChange={onChange}>
        <SelectTrigger id="blog-sort" className="w-44">
          <SelectValue placeholder="Most Recent" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Most Recent</SelectItem>
          {categories.map((c) => (
            <SelectItem key={c.slug} value={c.slug}>
              {c.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
