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
  return products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, limit);
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
