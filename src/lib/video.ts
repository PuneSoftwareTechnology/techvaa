/**
 * Turns a testimonial's video link (pasted in the admin) into something the
 * site can embed. Supported:
 *   - YouTube: watch?v=…, youtu.be/…, /shorts/…, /embed/…, /live/…
 *   - Instagram: /reel/…, /reels/…, /p/…, /tv/…
 * Anything else returns null and the testimonial falls back to its text.
 */
export type ParsedVideo =
  | { provider: "youtube"; id: string; embedUrl: string; thumbnail: string }
  | { provider: "instagram"; id: string; embedUrl: string };

const YT_ID = /^[\w-]{11}$/;

export function parseVideoUrl(raw: string | null | undefined): ParsedVideo | null {
  if (!raw) return null;
  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    return null;
  }
  const host = url.hostname.replace(/^(www\.|m\.)/, "");
  const parts = url.pathname.split("/").filter(Boolean);

  let ytId: string | null = null;
  if (host === "youtu.be") ytId = parts[0] ?? null;
  else if (host === "youtube.com" || host === "youtube-nocookie.com") {
    if (parts[0] === "watch") ytId = url.searchParams.get("v");
    else if (["shorts", "embed", "live", "v"].includes(parts[0])) ytId = parts[1] ?? null;
  }
  if (ytId && YT_ID.test(ytId)) {
    return {
      provider: "youtube",
      id: ytId,
      embedUrl: `https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1`,
      thumbnail: `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg`,
    };
  }

  if (host === "instagram.com" && ["reel", "reels", "p", "tv"].includes(parts[0]) && parts[1]) {
    const code = parts[1];
    if (/^[\w-]+$/.test(code)) {
      return {
        provider: "instagram",
        id: code,
        embedUrl: `https://www.instagram.com/p/${code}/embed/`,
      };
    }
  }

  return null;
}
