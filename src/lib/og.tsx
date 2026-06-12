import { ImageResponse } from "next/og";

/**
 * Shared building blocks for the dynamic Open Graph cards rendered per course
 * and per blog post. The visual language matches the static fallback in
 * `app/opengraph-image.tsx` (navy gradient + Techvaa wordmark) so social
 * previews stay on-brand across every route.
 */
export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

export function renderOgImage({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  // Keep very long titles from overflowing the card.
  const safeTitle = title.length > 110 ? `${title.slice(0, 107)}…` : title;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: "linear-gradient(135deg, #16315c 0%, #0f2348 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 40,
            fontWeight: 800,
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: "#f08a2b",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 30,
            }}
          >
            T
          </div>
          <span>
            Tech<span style={{ color: "#f08a2b" }}>vaa</span>
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              fontSize: 26,
              fontWeight: 600,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: "#f8b878",
            }}
          >
            {eyebrow}
          </div>
          <div style={{ fontSize: 60, fontWeight: 800, lineHeight: 1.08, maxWidth: 1000 }}>
            {safeTitle}
          </div>
        </div>

        <div style={{ fontSize: 28, color: "rgba(255,255,255,0.8)" }}>
          Live projects · Certified mentors · 100% placement support
        </div>
      </div>
    ),
    { ...OG_SIZE }
  );
}
