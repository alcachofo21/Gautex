import { products } from "@/lib/products";
import type { CartItem } from "@/types";
import type { CartPricing, EnabledPaymentMethod, PricedCartLine } from "./types";

export const PAYMENT_BRANDS = [
  "Visa",
  "Mastercard",
  "Amex",
  "Apple Pay",
  "Google Pay",
  "PayPal",
] as const;

export function priceCart(items: CartItem[]): CartPricing {
  const unpublishable: string[] = [];
  const lines: PricedCartLine[] = [];

  for (const item of items) {
    const product = products.find((p) => p.id === item.productId);
    if (!product?.price) {
      unpublishable.push(item.name);
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
    unpublishable,
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

export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY && process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
}

/** PayPal via Stripe Checkout (activate PayPal in Stripe Dashboard → Payment methods). */
export function isStripePayPalEnabled(): boolean {
  return process.env.STRIPE_PAYPAL_ENABLED !== "false";
}

/**
 * Stripe Checkout payment_method_types.
 * - card → Visa, Mastercard, Amex + Apple Pay / Google Pay (verificar dominio en Stripe)
 * - paypal → solo si STRIPE_PAYPAL_ENABLED=true y activado en Dashboard
 */
export function getStripePaymentMethodTypes(): ("card" | "paypal")[] {
  const types: ("card" | "paypal")[] = ["card"];
  if (isStripePayPalEnabled()) {
    types.push("paypal");
  }
  return types;
}

export function getEnabledPaymentMethods(locale: "es" | "en"): EnabledPaymentMethod[] {
  const brands = [...PAYMENT_BRANDS];
  if (!isStripePayPalEnabled()) {
    brands.pop();
  }

  return [
    {
      id: "stripe",
      label: locale === "en" ? "Secure checkout" : "Pago seguro",
      description:
        locale === "en"
          ? "Visa, Mastercard, Amex, Apple Pay and Google Pay"
          + (isStripePayPalEnabled() ? ", and PayPal via Stripe." : ".")
          : "Visa, Mastercard, Amex, Apple Pay y Google Pay"
          + (isStripePayPalEnabled() ? ", y PayPal vía Stripe." : "."),
      brands,
    },
  ];
}

export function hasInstantCheckout(): boolean {
  return isStripeConfigured();
}
