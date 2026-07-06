import corporateEs from "../../content/corporate.json";
import corporateEn from "../../content/corporate-en.json";
import categoriesEs from "../../content/categories.json";
import categoriesEn from "../../content/categories-en.json";
import uiEs from "../../content/i18n/es.json";
import uiEn from "../../content/i18n/en.json";
import campaignsEs from "../../content/campaigns.json";
import campaignsEn from "../../content/campaigns-en.json";
import testimonialsEs from "../../content/testimonials.json";
import testimonialsEn from "../../content/testimonials-en.json";
import partnersEs from "../../content/partners.json";
import partnersEn from "../../content/partners-en.json";
import blogEs from "../../content/blog.json";
import blogEn from "../../content/blog-en.json";
import sectorsEs from "../../content/sectors.json";
import sectorsEn from "../../content/sectors-en.json";
import type { Category } from "@/types";

export type BlogPost = {
  slug: string;
  date: string;
  title: string;
  excerpt: string;
  body: string;
};

export type Sector = {
  id: string;
  title: string;
  headline: string;
  description: string;
  benefits: string[];
  products: string[];
  image: string;
};

export type Locale = "es" | "en";

export function getLocaleFromPath(pathname: string): Locale {
  return pathname.startsWith("/en") ? "en" : "es";
}

export function localizedPath(path: string, locale: Locale): string {
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

export function switchLocalePath(pathname: string): string {
  const locale = getLocaleFromPath(pathname);
  const withoutEn = pathname.replace(/^\/en/, "") || "/";
  return locale === "en" ? withoutEn : localizedPath(withoutEn, "en");
}

export function getCorporate(locale: Locale) {
  return locale === "en" ? corporateEn : corporateEs;
}

export function getCategories(locale: Locale): Category[] {
  return (locale === "en" ? categoriesEn : categoriesEs) as Category[];
}

export function getUi(locale: Locale) {
  return locale === "en" ? uiEn : uiEs;
}

export function getCampaigns(locale: Locale) {
  return locale === "en" ? campaignsEn : campaignsEs;
}

export function getTestimonials(locale: Locale) {
  return locale === "en" ? testimonialsEn : testimonialsEs;
}

export function getPartners(locale: Locale) {
  return locale === "en" ? partnersEn : partnersEs;
}

export function getBlogPosts(locale: Locale): BlogPost[] {
  return (locale === "en" ? blogEn : blogEs) as BlogPost[];
}

export function getBlogPost(slug: string, locale: Locale): BlogPost | undefined {
  return getBlogPosts(locale).find((p) => p.slug === slug);
}

export function getSectors(locale: Locale): Sector[] {
  return (locale === "en" ? sectorsEn : sectorsEs) as Sector[];
}

export function getSector(id: string, locale: Locale): Sector | undefined {
  return getSectors(locale).find((s) => s.id === id);
}

export function sectorPath(id: string, locale: Locale): string {
  const base = locale === "en" ? "/en/sectors" : "/sectores";
  return `${base}/${id}`;
}

const sectorPairs: Record<string, { es: string; en: string }> = {
  farmacia: { es: "/sectores/farmacia", en: "/en/sectors/pharmacy" },
  hospital: { es: "/sectores/hospital", en: "/en/sectors/hospital" },
  distribuidor: { es: "/sectores/distribuidor", en: "/en/sectors/distributor" },
  pharmacy: { es: "/sectores/farmacia", en: "/en/sectors/pharmacy" },
  distributor: { es: "/sectores/distribuidor", en: "/en/sectors/distributor" },
};

export function getSectorAlternatePaths(id: string): { es: string; en: string } | undefined {
  return sectorPairs[id];
}

export function getProductText(
  product: { name: string; shortDescription: string; description: string; priceLabel: string },
  locale: Locale,
  en?: { name?: string; shortDescription?: string; description?: string; priceLabel?: string }
) {
  if (locale === "en" && en) {
    return {
      name: en.name ?? product.name,
      shortDescription: en.shortDescription || product.shortDescription,
      description: en.description || product.description,
      priceLabel: en.priceLabel || "Request quote",
    };
  }
  return product;
}
