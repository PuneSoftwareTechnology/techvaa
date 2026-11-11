import Script from "next/script";
import { LoadOnInteraction } from "./load-on-interaction";

/**
 * Google Analytics 4 (gtag.js). Renders nothing unless `NEXT_PUBLIC_GA_ID` is
 * set, so local/preview environments stay untracked without any code change —
 * just leave the env var blank.
 *
 * Split in two:
 *  - the tiny `dataLayer`/`gtag` stub runs right after hydration, so the
 *    page_view config and early Web Vitals events are queued from the start;
 *  - the ~180 KiB gtag.js library loads on the visitor's first interaction
 *    (see LoadOnInteraction) and then sends everything in the queue.
 */
export function GoogleAnalytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  if (!gaId) return null;

  return (
    <>
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${gaId}', { anonymize_ip: true });
        `}
      </Script>
      <LoadOnInteraction>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
          strategy="afterInteractive"
        />
      </LoadOnInteraction>
    </>
  );
}
