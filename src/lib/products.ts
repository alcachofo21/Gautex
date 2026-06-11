import productsData from "../../content/products.json";
import categoriesData from "../../content/categories.json";
import campaignsData from "../../content/campaigns.json";
import corporateData from "../../content/corporate.json";
import type { Product, Category } from "@/types";

export const products = productsData as unknown as Product[];
export const categories = categoriesData as unknown as Category[];
export const campaigns = campaignsData;
export const corporate = corporateData;

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
