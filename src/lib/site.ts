/**
 * Base URL for absolute links (emails, Stripe return URLs, SEO).
 * Prefer SITE_URL at runtime so Stripe redirects work without rebuilding
 * when NEXT_PUBLIC_SITE_URL was baked at build time.
 */
export function getSiteUrl(): string {
  return (
    process.env.SITE_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://www.gautex.com"
  );
}

export function absoluteUrl(path: string): string {
  const base = getSiteUrl().replace(/\/$/, "");
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${base}${clean}`;
}
