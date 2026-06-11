import corporateEs from "../../content/corporate.json";
import corporateEn from "../../content/corporate-en.json";
import categoriesEs from "../../content/categories.json";
import categoriesEn from "../../content/categories-en.json";
import uiEs from "../../content/i18n/es.json";
import uiEn from "../../content/i18n/en.json";
import type { Category } from "@/types";

export type Locale = "es" | "en";

export function getLocaleFromPath(pathname: string): Locale {
  return pathname.startsWith("/en") ? "en" : "es";
}

export function localizedPath(path: string, locale: Locale): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
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

export function getProductText(
  product: { name: string; shortDescription: string; description: string; priceLabel: string },
  locale: Locale,
  en?: { shortDescription?: string; description?: string; priceLabel?: string }
) {
  if (locale === "en" && en) {
    return {
      name: product.name,
      shortDescription: en.shortDescription || product.shortDescription,
      description: en.description || product.description,
      priceLabel: en.priceLabel || "Request quote",
    };
  }
  return product;
}
