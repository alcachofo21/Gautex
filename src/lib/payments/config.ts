import { products } from "@/lib/products";
import { isInStock, maxOrderQuantity } from "@/lib/inventory";
import type { CartItem } from "@/types";
import type { CartPricing, EnabledPaymentMethod, PricedCartLine } from "./types";

export const PAYMENT_BRANDS = ["PayPal"] as const;

export function isPayPalConfigured(): boolean {
  return Boolean(process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET);
}

export function getEnabledPaymentMethods(locale: "es" | "en"): EnabledPaymentMethod[] {
  return [
    {
      id: "paypal",
      label: locale === "en" ? "Pay with PayPal" : "Pagar con PayPal",
      description:
        locale === "en"
          ? "Pay securely with your PayPal account or card."
          : "Paga de forma segura con tu cuenta PayPal o tarjeta.",
      brands: ["PayPal"],
    },
  ];
}

export function hasInstantCheckout(): boolean {
  return isPayPalConfigured();
}

export function priceCart(items: CartItem[]): CartPricing {
  const unpublishable: string[] = [];
  const outOfStock: string[] = [];
  const lines: PricedCartLine[] = [];

  for (const item of items) {
    const product = products.find((p) => p.id === item.productId);
    if (!product?.price) {
      unpublishable.push(item.name);
      continue;
    }
    if (!isInStock(product)) {
      outOfStock.push(item.name);
      continue;
    }
    const max = maxOrderQuantity(product);
    if (max !== null && item.quantity > max) {
      outOfStock.push(item.name);
      continue;
    }
    lines.push({
      item,
      productId: item.productId,
      name: item.name,
      quantity: item.quantity,
      unitAmountCents: Math.round(product.price * 100),
      currency: "eur",
    });
  }

  const totalCents = lines.reduce((sum, l) => sum + l.unitAmountCents * l.quantity, 0);

  return {
    payable: lines.length === items.length && items.length > 0 && totalCents > 0,
    unpublishable: [...unpublishable, ...outOfStock],
    lines,
    totalCents,
    currency: "eur",
  };
}

export function formatEur(cents: number, locale: "es" | "en" = "es"): string {
  return new Intl.NumberFormat(locale === "en" ? "en-GB" : "es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}
