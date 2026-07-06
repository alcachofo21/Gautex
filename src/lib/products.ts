import productsData from "../../content/products.json";
import categoriesData from "../../content/categories.json";
import campaignsData from "../../content/campaigns.json";
import corporateData from "../../content/corporate.json";
import partnersData from "../../content/partners.json";
import testimonialsData from "../../content/testimonials.json";
import productsEnData from "../../content/products-en.json";
import type { Product, Category } from "@/types";

export const products = productsData as unknown as Product[];
export const categories = categoriesData as unknown as Category[];
export const campaigns = campaignsData;
export const corporate = corporateData;
export const partners = partnersData;
export const testimonials = testimonialsData;
export const productsEn = productsEnData as Record<
  string,
  { name?: string; shortDescription?: string; description?: string; priceLabel?: string }
>;

export function getProductBySlug(category: string, slug: string): Product | undefined {
  return products.find((p) => p.category === category && p.slug === slug);
}

export function getProductsByCategory(categoryId: string): Product[] {
  return products.filter((p) => p.category === categoryId);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured);
}

export function getCategoryById(id: string): Category | undefined {
  return categories.find((c) => c.id === id);
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  const sameCollection = products.filter(
    (p) => p.id !== product.id && getProductCollection(p) === getProductCollection(product)
  );
  const sameCategory = products.filter(
    (p) => p.id !== product.id && p.category === product.category && !sameCollection.includes(p)
  );
  return [...sameCollection, ...sameCategory].slice(0, limit);
}

export type CollectionId =
  | "preservativos"
  | "lubricantes"
  | "cubresondas"
  | "ecografia"
  | "tests"
  | "mascarillas"
  | "otros";

/**
 * Maps a product to a retail "collection" so the shop can prioritise and filter
 * by type (condoms first, then lubricants, cubresondas, etc.) even though the
 * underlying data only has 3 broad categories.
 */
export function getProductCollection(p: Product): CollectionId {
  const id = p.id.toLowerCase();
  if (p.category === "preventivo") {
    if (id.includes("gel") || id.startsWith("body-ars")) return "lubricantes";
    if (id.includes("condom") || id.includes("preservativo") || id === "sexydam") return "preservativos";
    return "otros";
  }
  if (p.category === "ginecologia") {
    if (id.includes("gecofun") || id.includes("cubresonda")) return "cubresondas";
    if (id.includes("gecogel") || id.includes("gel")) return "ecografia";
    return "otros";
  }
  if (p.category === "covid-19") {
    if (id.includes("nadal") || id.includes("covid")) return "tests";
    if (id.includes("mascarilla")) return "mascarillas";
    return "otros";
  }
  return "otros";
}

export const collectionOrder: CollectionId[] = [
  "preservativos",
  "lubricantes",
  "cubresondas",
  "ecografia",
  "tests",
  "mascarillas",
  "otros",
];

/** Sorts products so condoms come first, then lubricants, cubresondas, etc. */
export function sortByCollection(list: Product[]): Product[] {
  return [...list].sort(
    (a, b) => collectionOrder.indexOf(getProductCollection(a)) - collectionOrder.indexOf(getProductCollection(b))
  );
}

export function getProductsByCollection(collection: CollectionId): Product[] {
  return products.filter((p) => getProductCollection(p) === collection);
}

export function localizeProduct(product: Product, locale: "es" | "en"): Product {
  if (locale === "en" && productsEn[product.id]) {
    const en = productsEn[product.id];
    return {
      ...product,
      name: en.name ?? product.name,
      shortDescription: en.shortDescription ?? product.shortDescription,
      description: en.description ?? product.description,
      priceLabel: en.priceLabel ?? "Request quote",
    };
  }
  return product;
}

export function localizeProducts(list: Product[], locale: "es" | "en"): Product[] {
  return list.map((p) => localizeProduct(p, locale));
}
