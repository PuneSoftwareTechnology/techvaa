import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

// Search-engine crawlers we WANT — these drive SEO, so allow them fully.
const SEARCH_ENGINES = ["Googlebot", "Bingbot", "DuckDuckBot", "Applebot"];

// Bandwidth-hungry bots with no SEO value: AI training scrapers + 3rd-party
// SEO-analytics crawlers. Blocking these does NOT affect Google/Bing rankings.
const BLOCKED_BOTS = [
  // AI scrapers
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
      // Major search engines: crawl freely (minus private routes).
      {
        userAgent: SEARCH_ENGINES,
        allow: "/",
        disallow: ["/api/", "/admin/"],
      },
      // Junk bots: fully disallowed to conserve bandwidth.
      {
        userAgent: BLOCKED_BOTS,
        disallow: "/",
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
