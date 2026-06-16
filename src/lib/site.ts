export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL || "https://www.gautex.com";
}

export function absoluteUrl(path: string): string {
  const base = getSiteUrl().replace(/\/$/, "");
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${base}${clean}`;
}
