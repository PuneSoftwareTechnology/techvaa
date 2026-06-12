"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface CollapsibleContentProps {
  /** Content to show. Collapsed to `collapsedHeight` until expanded. */
  children: React.ReactNode;
  /** Max height (px) when collapsed. Defaults to 320. */
  collapsedHeight?: number;
  className?: string;
}

/**
 * Wraps long content in a height-clamped box with a fade-out and a
 * "Read more" / "Read less" toggle. The button only appears when the content
 * actually overflows the collapsed height, so short content renders untouched.
 * Client component — measures the content after render.
 */
export function CollapsibleContent({
  children,
  collapsedHeight = 320,
  className,
}: CollapsibleContentProps) {
  const innerRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [overflows, setOverflows] = useState(false);

  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;

    const measure = () => setOverflows(el.scrollHeight > collapsedHeight + 1);
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [collapsedHeight]);

  const clamped = overflows && !expanded;

  return (
    <div className={className}>
      <div
        className="relative overflow-hidden transition-[max-height] duration-300 ease-in-out"
        style={{ maxHeight: clamped ? collapsedHeight : innerRef.current?.scrollHeight ?? "none" }}
      >
        <div ref={innerRef}>{children}</div>
        {clamped && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-background to-transparent" />
        )}
      </div>

      {overflows && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          className="mt-3 text-accent-orange hover:text-accent-orange"
        >
          {expanded ? "Read less" : "Read more"}
          <ChevronDown
            aria-hidden="true"
            className={cn("transition-transform duration-200", expanded && "rotate-180")}
          />
        </Button>
      )}
    </div>
  );
}
