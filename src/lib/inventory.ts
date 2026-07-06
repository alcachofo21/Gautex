import inventoryData from "../../content/inventory.json";
import type { Product } from "@/types";

type InventorySku = {
  sku: string;
  productId?: string;
  name: string;
  stockBoxes: number;
  channel: "b2c" | "public_entity" | "quote_only";
  webVisible: boolean;
  aggregate?: boolean;
};

type InventoryFile = {
  updatedAt: string;
  unit: string;
  skus: InventorySku[];
  productOverrides: Record<
    string,
    { webVisible?: boolean; stockBoxes?: number; channel?: string }
  >;
};

const inventory = inventoryData as InventoryFile;

function buildStockByProductId(): Map<string, number> {
  const map = new Map<string, number>();
  for (const row of inventory.skus) {
    if (!row.productId || row.channel === "public_entity" || !row.webVisible) continue;
    const prev = map.get(row.productId) ?? 0;
    map.set(row.productId, prev + row.stockBoxes);
  }
  return map;
}

const stockByProductId = buildStockByProductId();

export function getInventoryUpdatedAt(): string {
  return inventory.updatedAt;
}

export function applyInventory(product: Product): Product {
  const override = inventory.productOverrides[product.id];
  const stockFromSku = stockByProductId.get(product.id);

  if (override?.webVisible === false) {
    return {
      ...product,
      stockQuantity: override.stockBoxes ?? 0,
      webVisible: false,
    };
  }

  if (stockFromSku !== undefined) {
    return {
      ...product,
      stockQuantity: stockFromSku,
      webVisible: true,
    };
  }

  return {
    ...product,
    stockQuantity: 0,
    webVisible: false,
  };
}

export function isShopProduct(product: Product): boolean {
  const enriched = product.webVisible !== undefined ? product : applyInventory(product);
  return enriched.webVisible !== false;
}

export function isInStock(product: Product): boolean {
  const enriched = product.stockQuantity !== undefined ? product : applyInventory(product);
  if (enriched.stockQuantity === null || enriched.stockQuantity === undefined) {
    return false;
  }
  return enriched.stockQuantity > 0;
}

export function maxOrderQuantity(product: Product): number | null {
  const enriched = product.stockQuantity !== undefined ? product : applyInventory(product);
  if (enriched.stockQuantity === null || enriched.stockQuantity === undefined) return null;
  return enriched.stockQuantity;
}

export function enrichProducts(list: Product[]): Product[] {
  return list.map(applyInventory);
}

export function getShopProducts(list: Product[]): Product[] {
  return enrichProducts(list).filter(isShopProduct);
}

export function getProductStock(productId: string): number | null {
  return stockByProductId.get(productId) ?? null;
}
