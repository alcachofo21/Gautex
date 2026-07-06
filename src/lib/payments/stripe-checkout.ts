import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { absoluteUrl } from "@/lib/site";
import { getStripePaymentMethodTypes } from "./config";
import type { CartPricing } from "./types";

type CreateStripeSessionInput = {
  pricing: CartPricing;
  locale: "es" | "en";
  customerEmail?: string;
};

export async function createStripeCheckoutSession({
  pricing,
  locale,
  customerEmail,
}: CreateStripeSessionInput): Promise<Stripe.Checkout.Session> {
  const stripe = getStripe();
  if (!stripe) throw new Error("Stripe no configurado");

  const prefix = locale === "en" ? "/en" : "";

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = pricing.lines.map((line) => ({
    price_data: {
      currency: pricing.currency,
      unit_amount: line.unitAmountCents,
      product_data: {
        name: line.name,
      },
    },
    quantity: line.quantity,
  }));

  return stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: getStripePaymentMethodTypes(),
    line_items,
    locale: locale === "en" ? "en" : "es",
    success_url: absoluteUrl(`${prefix}/checkout?success=true&provider=stripe`),
    cancel_url: absoluteUrl(`${prefix}/carrito`),
    billing_address_collection: "auto",
    phone_number_collection: { enabled: true },
    customer_email: customerEmail || undefined,
    metadata: {
      provider: "stripe",
      itemIds: pricing.lines.map((l) => `${l.productId}x${l.quantity}`).join(","),
      totalCents: String(pricing.totalCents),
    },
  });
}
