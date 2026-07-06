import type { Metadata } from "next";
import { absoluteUrl } from "./site";
import type { Locale } from "./locale";

type PageMetaInput = {
  title: string;
  description: string;
  path: string;
  locale?: Locale;
  image?: string;
  noIndex?: boolean;
  /** Override alternate paths when ES/EN URLs differ (e.g. sectors) */
  alternatePaths?: { es: string; en: string };
};

/** Path without locale prefix, e.g. `/productos` or `/productos/preventivo/matrix-condoms` */
export function localePath(path: string, locale: Locale): string {
  const aliases: Record<string, string> = {
    "/sectores": "/sectors",
  };
  const normalized = aliases[path] && locale === "en" ? aliases[path] : path;
  const clean = normalized.startsWith("/") ? normalized : `/${normalized}`;
  if (locale === "en") {
    return clean === "/" ? "/en" : `/en${clean}`;
  }
  return clean;
}

export function buildPageMetadata({
  title,
  description,
  path,
  locale = "es",
  image = "/images/hero/condones-seguro.webp",
  noIndex = false,
  alternatePaths,
}: PageMetaInput): Metadata {
  const esPath = alternatePaths?.es ?? localePath(path, "es");
  const enPath = alternatePaths?.en ?? localePath(path, "en");
  const canonicalPath = locale === "en" ? enPath : esPath;

  return {
    title,
    description,
    alternates: {
      canonical: absoluteUrl(canonicalPath),
      languages: {
        es: absoluteUrl(esPath),
        en: absoluteUrl(enPath),
        "x-default": absoluteUrl(esPath),
      },
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl(canonicalPath),
      locale: locale === "en" ? "en_GB" : "es_ES",
      type: "website",
      images: [{ url: image, width: 1280, height: 720, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    ...(noIndex ? { robots: { index: false, follow: false } } : {}),
  };
}
