export type AnalyticsEvent =
  | "add_to_cart"
  | "begin_checkout"
  | "quote_request"
  | "contact_submit"
  | "campaign_submit"
  | "newsletter_signup";

export function trackEvent(name: AnalyticsEvent, params?: Record<string, string | number>): void {
  if (typeof window === "undefined") return;

  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  if (gaId && typeof window.gtag === "function") {
    window.gtag("event", name, params);
  }

  const plausible = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  if (plausible && typeof window.plausible === "function") {
    window.plausible(name, { props: params });
  }
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    plausible?: (event: string, options?: { props?: Record<string, string | number> }) => void;
  }
}
