import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { absoluteUrl } from "@/lib/site";
import { sendPurchaseEmails } from "@/lib/email";
import { getStripePaymentMethodTypes } from "./config";
import type { CartPricing } from "./types";

/** EU + nearby markets Gautex typically ships to. */
const SHIPPING_COUNTRIES: Stripe.Checkout.SessionCreateParams.ShippingAddressCollection.AllowedCountry[] =
  [
    "ES",
    "PT",
    "FR",
    "DE",
    "IT",
    "BE",
    "NL",
    "LU",
    "AT",
    "IE",
    "PL",
    "CZ",
    "SK",
    "HU",
    "RO",
    "BG",
    "HR",
    "SI",
    "GR",
    "SE",
    "DK",
    "FI",
    "EE",
    "LV",
    "LT",
    "MT",
    "CY",
    "AD",
    "CH",
    "GB",
  ];

type CreateStripeSessionInput = {
  pricing: CartPricing;
  locale: "es" | "en";
  customerEmail?: string;
};

function formatShippingAddress(
  shipping: Stripe.Checkout.Session.ShippingDetails | null | undefined,
  customer: Stripe.Checkout.Session.CustomerDetails | null | undefined
): string | undefined {
  const addr = shipping?.address || customer?.address;
  if (!addr) return undefined;

  const name = shipping?.name || customer?.name || undefined;
  const phone = shipping?.phone || customer?.phone || undefined;
  const lines = [
    name,
    addr.line1,
    addr.line2,
    [addr.postal_code, addr.city].filter(Boolean).join(" "),
    addr.state,
    addr.country,
    phone ? `Tel: ${phone}` : undefined,
  ].filter((line): line is string => Boolean(line && String(line).trim()));

  return lines.length ? lines.join("\n") : undefined;
}

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
    success_url: absoluteUrl(
      `${prefix}/checkout?success=true&provider=stripe&session_id={CHECKOUT_SESSION_ID}`
    ),
    cancel_url: absoluteUrl(`${prefix}/carrito`),
    billing_address_collection: "required",
    phone_number_collection: { enabled: true },
    shipping_address_collection: {
      allowed_countries: SHIPPING_COUNTRIES,
    },
    customer_email: customerEmail || undefined,
    metadata: {
      provider: "stripe",
      locale,
      itemIds: pricing.lines.map((l) => `${l.productId}x${l.quantity}`).join(","),
      itemSummary: pricing.lines.map((l) => `${l.name} × ${l.quantity}`).join(", "),
      totalCents: String(pricing.totalCents),
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
    session.shipping_details?.name?.split(" ")[0] ||
    session.customer_details?.name?.split(" ")[0];
  const shippingAddress = formatShippingAddress(
    session.shipping_details,
    session.customer_details
  );

  const result = await sendPurchaseEmails({
    provider: "stripe",
    orderId: session.id,
    locale,
    totalCents,
    customerEmail: session.customer_details?.email || undefined,
    customerName,
    customerPhone: session.customer_details?.phone || session.shipping_details?.phone || undefined,
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
      ...(shippingAddress ? { shippingAddress: shippingAddress.slice(0, 450) } : {}),
    },
  });

  return { ok: true };
}
