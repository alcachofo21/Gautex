/**
 * Base URL for absolute links (emails, Stripe return URLs, SEO).
 * Prefer SITE_URL at runtime so Stripe redirects work without rebuilding
 * when NEXT_PUBLIC_SITE_URL was baked at build time.
 *
 * Use bracket access so Next/webpack does not inline empty values at build time.
 * Canonical Render hostname is gautex-web-zzbo (gautex-web.onrender.com is a
 * stale orphan host that does not receive our deploys).
 */
export function getSiteUrl(): string {
  const runtime =
    process.env["SITE_URL"]?.trim() ||
    process.env["NEXT_PUBLIC_SITE_URL"]?.trim();
  if (runtime) return runtime;
  return "https://gautex-web-zzbo.onrender.com";
}

export function absoluteUrl(path: string): string {
  const base = getSiteUrl().replace(/\/$/, "");
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${base}${clean}`;
}
