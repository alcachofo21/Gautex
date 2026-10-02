import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { absoluteUrl } from "@/lib/site";
import { sendPurchaseEmails } from "@/lib/email";
import { getStripePaymentMethodTypes } from "./config";
import type { CartPricing } from "./types";

export type CheckoutShipping = {
  fullName: string;
  addressLine: string;
  postalCode: string;
  city: string;
  province: string;
  phone?: string;
};

type CreateStripeSessionInput = {
  pricing: CartPricing;
  locale: "es" | "en";
  customerEmail?: string;
  shipping?: CheckoutShipping;
};

function formatManualShipping(shipping: CheckoutShipping): string {
  return [
    shipping.fullName,
    shipping.addressLine,
    `${shipping.postalCode} ${shipping.city}`,
    shipping.province,
    shipping.phone ? `Tel: ${shipping.phone}` : undefined,
  ]
    .filter(Boolean)
    .join("\n");
}

export async function createStripeCheckoutSession({
  pricing,
  locale,
  customerEmail,
  shipping,
}: CreateStripeSessionInput): Promise<Stripe.Checkout.Session> {
  const stripe = getStripe();
  if (!stripe) throw new Error("Stripe no configurado");

  const prefix = locale === "en" ? "/en" : "";
  const shippingAddress = shipping ? formatManualShipping(shipping) : undefined;

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
    success_url: absoluteUrl(
      `${prefix}/checkout?success=true&provider=stripe&session_id={CHECKOUT_SESSION_ID}`
    ),
    cancel_url: absoluteUrl(`${prefix}/carrito`),
    billing_address_collection: "auto",
    phone_number_collection: { enabled: true },
    customer_email: customerEmail || undefined,
    metadata: {
      provider: "stripe",
      locale,
      itemIds: pricing.lines.map((l) => `${l.productId}x${l.quantity}`).join(","),
      itemSummary: pricing.lines.map((l) => `${l.name} × ${l.quantity}`).join(", "),
      totalCents: String(pricing.totalCents),
      ...(shippingAddress ? { shippingAddress: shippingAddress.slice(0, 450) } : {}),
      ...(shipping?.phone ? { shippingPhone: shipping.phone.slice(0, 30) } : {}),
      ...(shipping?.fullName ? { shippingName: shipping.fullName.slice(0, 100) } : {}),
    },
  });
}

export async function fulfillStripeCheckoutSession(
  sessionId: string
): Promise<{ ok: boolean; error?: string; alreadySent?: boolean }> {
  const stripe = getStripe();
  if (!stripe) {
    return { ok: false, error: "Stripe no configurado" };
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId);
  if (session.payment_status !== "paid") {
    return { ok: false, error: "Pago no completado" };
  }

  if (session.metadata?.purchaseEmailSent === "true") {
    return { ok: true, alreadySent: true };
  }

  const locale = session.metadata?.locale === "en" ? "en" : "es";
  const totalCents = Number(session.metadata?.totalCents || session.amount_total || 0);
  const customerName =
    session.metadata?.shippingName?.split(" ")[0] ||
    session.customer_details?.name?.split(" ")[0];
  const shippingAddress = session.metadata?.shippingAddress || undefined;
  const customerPhone =
    session.metadata?.shippingPhone || session.customer_details?.phone || undefined;

  const result = await sendPurchaseEmails({
    provider: "stripe",
    orderId: session.id,
    locale,
    totalCents,
    customerEmail: session.customer_details?.email || undefined,
    customerName,
    customerPhone,
    itemsSummary: session.metadata?.itemSummary || session.metadata?.itemIds,
    shippingAddress,
  });

  if (!result.ok) {
    return result;
  }

  await stripe.checkout.sessions.update(sessionId, {
    metadata: {
      ...session.metadata,
      purchaseEmailSent: "true",
    },
  });

  return { ok: true };
}
