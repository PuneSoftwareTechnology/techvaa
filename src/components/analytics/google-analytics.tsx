import Script from "next/script";

/**
 * Google Analytics 4 (gtag.js), loaded with `lazyOnload` (after the page finishes loading) so it stays off
 * the critical render path and never blocks LCP. Renders nothing unless
 * `NEXT_PUBLIC_GA_ID` is set, so local/preview environments stay untracked
 * without any code change — just leave the env var blank.
 */
export function GoogleAnalytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  if (!gaId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="lazyOnload"
      />
      <Script id="ga4-init" strategy="lazyOnload">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}', { anonymize_ip: true });
        `}
      </Script>
    </>
  );
}
