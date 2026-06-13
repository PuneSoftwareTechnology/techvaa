import type { NextConfig } from "next";

/**
 * Security headers applied to every route. Strict but allows the image
 * origins we use for remote media (S3, Unsplash placeholders).
 */
const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  // Multiple lockfiles exist on this machine; pin the workspace root.
  turbopack: { root: import.meta.dirname },

  // Image optimization: serve modern formats, allow remote media origins.
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "**.amazonaws.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "picsum.photos" },
    ],
    deviceSizes: [360, 640, 768, 1024, 1280, 1536, 1920],
    // Cache optimized images for 30 days so re-crawls / repeat visits don't
    // re-trigger optimization (each re-optimization re-fetches the source).
    minimumCacheTTL: 2592000,
  },

  // Keep server-only DB packages out of the client bundle.
  serverExternalPackages: ["@prisma/client", "@prisma/adapter-pg", "pg"],

  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      // Static media is content-hashed or rarely changes — cache hard so
      // repeat visitors and bot re-crawls don't re-download it (saves transfer).
      {
        source:
          "/:all*(svg|png|jpg|jpeg|gif|webp|avif|ico|woff|woff2|ttf|otf)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
