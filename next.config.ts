import type { NextConfig } from "next";

/**
 * Content-Security-Policy. Allowlists exactly the third parties this site loads:
 * Google Analytics/Tag Manager, Microsoft Clarity, Meta Pixel, reCAPTCHA and
 * the Google Maps embed. `'unsafe-inline'`/`'unsafe-eval'` are required because
 * GA/Clarity/Pixel use inline bootstrap snippets and reCAPTCHA evals — so this
 * is a baseline (origin allowlist + clickjacking/base-uri/form-action lockdown)
 * rather than a strict nonce CSP. `img-src https:` avoids whack-a-mole with the
 * many remote image origins (S3, Unsplash, picsum, partner favicons).
 *
 * If you add a new third-party script, add its origin to script-src/connect-src
 * here or it will be blocked. Test forms + map after any change.
 */
const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'self'",
  "form-action 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://*.clarity.ms https://connect.facebook.net https://www.google.com https://www.gstatic.com https://maps.googleapis.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data: https://fonts.gstatic.com",
  "connect-src 'self' https://www.googletagmanager.com https://*.google-analytics.com https://*.analytics.google.com https://*.clarity.ms https://c.bing.com https://connect.facebook.net https://www.facebook.com https://stats.g.doubleclick.net https://www.google.com",
  "frame-src 'self' https://www.google.com https://*.facebook.com https://td.doubleclick.net",
  "worker-src 'self' blob:",
  "upgrade-insecure-requests",
].join("; ");

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
  { key: "Content-Security-Policy", value: csp },
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

  // Keep server-only DB packages external (unbundled) on the server. These are
  // the packages prisma.ts actually imports at runtime — the Neon serverless
  // driver, its Prisma adapter and the `ws` WebSocket implementation. Bundling
  // `ws`/the Neon driver can break the WebSocket connection in production, so
  // they must stay external. (`@prisma/adapter-pg`/`pg` are kept for the
  // migration/seed scripts that still use the direct pg connection.)
  serverExternalPackages: [
    "@prisma/client",
    "@prisma/adapter-neon",
    "@neondatabase/serverless",
    "ws",
    "@prisma/adapter-pg",
    "pg",
  ],

  // The blog section moved from /blog to /blogs. Permanently redirect the old
  // URLs so existing links, bookmarks and indexed pages keep working.
  async redirects() {
    return [
      { source: "/blog", destination: "/blogs", permanent: true },
      { source: "/blog/:slug", destination: "/blogs/:slug", permanent: true },
    ];
  },

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
