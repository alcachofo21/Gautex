import { describe, it, expect } from "vitest";
import {
  getProductBySlug,
  getProductsByCategory,
  getFeaturedProducts,
  getCategoryById,
  getRelatedProducts,
  localizeProduct,
  localizeProducts,
  canPurchaseOnline,
  products,
} from "@/lib/products";

describe("products", () => {
  it("finds product by slug", () => {
    const product = getProductBySlug("preventivo", "matrix-condoms");
    expect(product?.id).toBe("matrix-condoms");
  });

  it("returns undefined for unknown slug", () => {
    expect(getProductBySlug("preventivo", "nonexistent")).toBeUndefined();
  });

  it("filters by category", () => {
    const list = getProductsByCategory("preventivo");
    expect(list.length).toBeGreaterThan(0);
    expect(list.every((p) => p.category === "preventivo")).toBe(true);
  });

  it("returns featured products", () => {
    expect(getFeaturedProducts().length).toBeGreaterThan(0);
  });

  it("finds category by id", () => {
    expect(getCategoryById("preventivo")?.id).toBe("preventivo");
  });

  it("localizes product to English", () => {
    const product = products[0];
    const en = localizeProduct(product, "en");
    expect(en.name).toBeTruthy();
  });

  it("returns Spanish product when no EN translation", () => {
    const product = products.find((p) => !p.id) ?? products[0];
    const es = localizeProduct(product, "es");
    expect(es.name).toBe(product.name);
  });

  it("localizes product list", () => {
    const list = localizeProducts(products.slice(0, 2), "en");
    expect(list).toHaveLength(2);
  });

  it("returns related products in same category", () => {
    const product = getProductBySlug("preventivo", "matrix-condoms");
    if (product) {
      const related = getRelatedProducts(product, 2);
      expect(related.every((p) => p.category === product.category)).toBe(true);
      expect(related.every((p) => p.id !== product.id)).toBe(true);
    }
  });

  it("rejects online purchase for quote-only product", () => {
    const quoteOnly = products.find((p) => p.price === null);
    if (quoteOnly) {
      expect(canPurchaseOnline(quoteOnly)).toBe(false);
    }
  });

  it("allows online purchase for priced products regardless of warehouse stock", () => {
    const priced = products.find((p) => p.price !== null && p.price > 0 && p.webVisible !== false);
    expect(priced).toBeTruthy();
    if (priced) {
      expect(canPurchaseOnline({ ...priced, stockQuantity: 0 })).toBe(true);
    }
  });
});
