"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { InstagramIcon } from "@/components/common/social-icons";
import type { ParsedVideo } from "@/lib/video";

/**
 * Click-to-play video for a testimonial card. Shows a lightweight preview
 * (YouTube thumbnail / Instagram placeholder) and only loads the third-party
 * player iframe once the visitor clicks — so a page of video testimonials
 * costs no extra JavaScript or requests until someone actually watches.
 */
export function TestimonialVideo({
  video,
  title,
}: {
  video: ParsedVideo;
  title: string;
}) {
  const [playing, setPlaying] = useState(false);
  const isYouTube = video.provider === "youtube";
  // YouTube is landscape; Instagram reels are portrait (plus caption chrome).
  const frame = isYouTube ? "aspect-video" : "h-[28rem]";

  if (playing) {
    return (
      <div className={`overflow-hidden rounded-xl bg-black ${frame}`}>
        <iframe
          src={video.embedUrl}
          title={title}
          className="size-full"
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      aria-label={`Play video: ${title}`}
      className={`group/video relative block w-full overflow-hidden rounded-xl ${isYouTube ? "aspect-video bg-black" : "aspect-video bg-[radial-gradient(circle_at_30%_107%,#fdf497_0%,#fd5949_45%,#d6249f_60%,#285AEB_90%)]"}`}
    >
      {isYouTube ? (
        // eslint-disable-next-line @next/next/no-img-element -- external YouTube thumbnail; plain img keeps it out of the image optimizer
        <img
          src={video.thumbnail}
          alt=""
          loading="lazy"
          decoding="async"
          className="size-full object-cover transition-transform duration-300 group-hover/video:scale-105"
        />
      ) : (
        <InstagramIcon className="absolute left-4 top-4 size-6 text-white" />
      )}
      <span className="absolute inset-0 grid place-items-center bg-black/20 transition-colors group-hover/video:bg-black/30">
        <span className="grid size-14 place-items-center rounded-full bg-white/95 text-brand shadow-lg transition-transform group-hover/video:scale-110">
          <Play className="ml-0.5 size-6 fill-current" aria-hidden="true" />
        </span>
      </span>
    </button>
  );
}
