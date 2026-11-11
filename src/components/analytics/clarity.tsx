import Script from "next/script";
import { LoadOnInteraction } from "./load-on-interaction";

/**
 * Microsoft Clarity (session replay + heatmaps). Loaded on the visitor's first
 * interaction (see LoadOnInteraction) so it stays off the initial page load.
 * Renders nothing unless `NEXT_PUBLIC_CLARITY_ID` is set, so local/preview
 * environments stay untracked — just leave the env var blank.
 *
 * Get the project ID from https://clarity.microsoft.com → Settings → it's the
 * short token in the install snippet (`clarity.ms/tag/<ID>`).
 */
export function MicrosoftClarity() {
  const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID;
  if (!clarityId) return null;

  return (
    <LoadOnInteraction>
      <Script id="ms-clarity-init" strategy="afterInteractive">
        {`
          (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "${clarityId}");
        `}
      </Script>
    </LoadOnInteraction>
  );
}
