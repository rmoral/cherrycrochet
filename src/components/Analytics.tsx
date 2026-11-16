import Script from "next/script";
import { analytics, analyticsEnabled } from "@/lib/analytics";

/** Script del proveedor de medición. Sin NEXT_PUBLIC_PLAUSIBLE_DOMAIN no se renderiza nada. */
export function AnalyticsScript() {
  if (!analyticsEnabled()) return null;
  return <Script src={analytics.src} data-domain={analytics.domain} strategy="afterInteractive" />;
}
