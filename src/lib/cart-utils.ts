import { products } from "@/lib/products";
import { maxOrderQuantity } from "@/lib/inventory";

export function clampQuantity(productId: string, quantity: number): number {
  const product = products.find((p) => p.id === productId);
  if (!product) return Math.max(1, quantity);
  const max = maxOrderQuantity(product);
  if (max === null) return Math.max(1, quantity);
  return Math.max(1, Math.min(quantity, max));
}
