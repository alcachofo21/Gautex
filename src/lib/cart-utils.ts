export function clampQuantity(_productId: string, quantity: number): number {
  return Math.max(1, quantity);
}
