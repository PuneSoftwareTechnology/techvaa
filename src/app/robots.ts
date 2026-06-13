import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

// Crawlers we explicitly welcome: search engines (drive SEO) plus AI and
// SEO-analytics bots. All crawl freely, minus private routes.
const ALLOWED_BOTS = [
  // Search engines
  "Googlebot",
  "Bingbot",
  "DuckDuckBot",
  "Applebot",
  // AI crawlers
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "anthropic-ai",
  "Claude-Web",
  "CCBot",
  "Google-Extended",
  "PerplexityBot",
  "Bytespider",
  "Amazonbot",
  "Applebot-Extended",
  "FacebookBot",
  "Meta-ExternalAgent",
  "Diffbot",
  "ImagesiftBot",
  "Omgilibot",
  "cohere-ai",
  // SEO-analytics crawlers
  "AhrefsBot",
  "SemrushBot",
  "MJ12bot",
  "DotBot",
  "DataForSeoBot",
  "BLEXBot",
  "PetalBot",
  "SeekportBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Welcomed crawlers (search + AI + SEO): crawl freely, minus private routes.
      {
        userAgent: ALLOWED_BOTS,
        allow: "/",
        disallow: ["/api/", "/admin/"],
      },
      // Everyone else: allowed but throttled to one page every 10s.
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/"],
        crawlDelay: 10,
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl("/"),
  };
}
