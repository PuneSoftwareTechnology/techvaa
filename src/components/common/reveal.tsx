"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

const variants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: i * 0.08 },
  }),
};

/**
 * Paths whose reveal animations have already played. Lives at module scope so
 * it survives client-side navigation (the bundle stays loaded); it only resets
 * on a full page reload. Keeps the first-visit animation but renders statically
 * when you navigate back to a page you've already seen this session.
 */
const played = new Set<string>();

/**
 * Lightweight scroll-reveal wrapper. Honours prefers-reduced-motion by
 * rendering content statically. `index` staggers items in a list.
 */
export function Reveal({
  children,
  className,
  index = 0,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  index?: number;
  as?: "div" | "li" | "section" | "article";
}) {
  const reduce = useReducedMotion();
  const pathname = usePathname();
  // Snapshot once on mount: all reveals on a first visit read `false` together
  // (effects that mark the path as played commit only after this render pass).
  const [animate] = useState(() => !played.has(pathname));
  const MotionTag = motion[as];

  useEffect(() => {
    played.add(pathname);
  }, [pathname]);

  if (reduce || !animate) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <MotionTag
      className={cn(className)}
      custom={index}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
    >
      {children}
    </MotionTag>
  );
}
