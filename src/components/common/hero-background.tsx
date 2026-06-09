import { cn } from "@/lib/utils";

/**
 * Decorative hero backdrop: layered radial glows, a subtle grid, soft colour
 * blur bubbles and floating circle bubbles. Pure CSS, zero image weight.
 *
 * Sits behind hero content on a `bg-brand` section. The parent must be
 * `relative overflow-hidden`; render this as the first child and put the real
 * content in a `relative` wrapper after it.
 */
export function HeroBackground({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0", className)}
    >
      {/* layered background */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_85%_-10%,oklch(0.46_0.11_258),transparent_55%),radial-gradient(90%_90%_at_-10%_110%,oklch(0.22_0.07_258),transparent_60%)]" />
      {/* subtle grid lines */}
      <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(100%_100%_at_50%_0%,black,transparent_75%)]" />
      {/* color artifacts */}
      <div className="absolute -right-24 top-16 size-80 rounded-full bg-accent-orange/30 blur-3xl" />
      <div className="absolute -left-20 top-40 size-72 rounded-full bg-[oklch(0.62_0.16_300)]/25 blur-3xl" />
      <div className="absolute bottom-0 left-1/3 size-72 rounded-full bg-[oklch(0.7_0.15_200)]/20 blur-3xl" />
      {/* glow ring accent */}
      <div className="absolute -right-10 bottom-10 size-40 rounded-full border border-accent-orange/20 [mask-image:radial-gradient(closest-side,transparent_60%,black)]" />
      {/* circle bubbles */}
      <span className="absolute left-[8%] top-[18%] size-24 rounded-full border border-white/15 bg-white/5 backdrop-blur-sm" />
      <span className="absolute left-[22%] top-[62%] size-10 rounded-full border border-accent-orange/30 bg-accent-orange/10" />
      <span className="absolute right-[14%] top-[12%] size-16 rounded-full border border-white/10 bg-white/5" />
      <span className="absolute right-[28%] bottom-[16%] size-12 rounded-full bg-[oklch(0.7_0.15_200)]/20" />
      <span className="absolute left-[46%] top-[8%] size-6 rounded-full bg-accent-orange/40" />
      <span className="absolute left-[38%] bottom-[10%] size-3 rounded-full bg-white/40" />
      <span className="absolute right-[8%] top-[46%] size-4 rounded-full bg-white/30" />
      <span className="absolute left-[12%] bottom-[24%] size-5 rounded-full border border-white/20" />
      <span className="absolute right-[20%] top-[34%] size-8 rounded-full border border-[oklch(0.62_0.16_300)]/40 bg-[oklch(0.62_0.16_300)]/10" />
    </div>
  );
}
