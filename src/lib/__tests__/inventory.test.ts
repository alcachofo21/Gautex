import { describe, it, expect } from "vitest";
import {
  applyInventory,
  isInStock,
  maxOrderQuantity,
  isShopProduct,
  getProductStock,
  getInventoryUpdatedAt,
} from "@/lib/inventory";
import type { Product } from "@/types";

const baseProduct: Product = {
  id: "matrix-condoms",
  slug: "matrix-condoms",
  name: "Matrix",
  category: "preventivo",
  featured: true,
  shortDescription: "Test",
  description: "Test",
  price: 20.9,
  priceLabel: "20,90 €",
  specs: {},
  certifications: [],
  color: "#000",
};

describe("inventory", () => {
  it("enriches product with stock", () => {
    const enriched = applyInventory(baseProduct);
    expect(enriched.stockQuantity).toBeDefined();
  });

  it("checks stock for known product", () => {
    const enriched = applyInventory(baseProduct);
    expect(typeof isInStock(enriched)).toBe("boolean");
  });

  it("returns max order quantity", () => {
    const enriched = applyInventory(baseProduct);
    const max = maxOrderQuantity(enriched);
    if (max !== null) {
      expect(max).toBeGreaterThan(0);
    }
  });

  it("identifies shop products", () => {
    const enriched = applyInventory(baseProduct);
    expect(typeof isShopProduct(enriched)).toBe("boolean");
  });

  it("gets product stock by id", () => {
    const stock = getProductStock("matrix-condoms");
    if (stock !== null) {
      expect(stock).toBeGreaterThanOrEqual(0);
    }
  });

  it("hides product when override sets webVisible false", () => {
    const hidden = applyInventory({ ...baseProduct, id: "viva-condoms-xl" });
    expect(hidden.webVisible).toBe(false);
  });

  it("returns inventory timestamp", () => {
    expect(getInventoryUpdatedAt()).toMatch(/\d{4}-\d{2}-\d{2}/);
  });

  it("evaluates shop product via inventory when fields missing", () => {
    const raw = { ...baseProduct, stockQuantity: undefined, webVisible: undefined };
    expect(typeof isShopProduct(raw)).toBe("boolean");
  });

  it("returns false for zero stock", () => {
    expect(isInStock({ ...baseProduct, stockQuantity: 0 })).toBe(false);
  });
});
