import type { CartPricing } from "./types";

function paypalBaseUrl(): string {
  return process.env.PAYPAL_MODE === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";
}

async function getAccessToken(): Promise<string> {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_CLIENT_SECRET;
  if (!clientId || !secret) throw new Error("PayPal no configurado");

  const auth = Buffer.from(`${clientId}:${secret}`).toString("base64");
  const res = await fetch(`${paypalBaseUrl()}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!res.ok) throw new Error("PayPal auth failed");
  const data = (await res.json()) as { access_token: string };
  return data.access_token;
}

export async function createPayPalOrder(
  pricing: CartPricing,
  locale: "es" | "en"
): Promise<{ orderId: string; approvalUrl: string }> {
  const token = await getAccessToken();
  const prefix = locale === "en" ? "/en" : "";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const body = {
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "EUR",
          value: (pricing.totalCents / 100).toFixed(2),
          breakdown: {
            item_total: {
              currency_code: "EUR",
              value: (pricing.totalCents / 100).toFixed(2),
            },
          },
        },
        items: pricing.lines.map((line) => ({
          name: line.name.slice(0, 127),
          quantity: String(line.quantity),
          unit_amount: {
            currency_code: "EUR",
            value: (line.unitAmountCents / 100).toFixed(2),
          },
          category: "PHYSICAL_GOODS",
        })),
      },
    ],
    application_context: {
      brand_name: "Gautex Medica",
      landing_page: "NO_PREFERENCE",
      user_action: "PAY_NOW",
      return_url: `${siteUrl}${prefix}/checkout/paypal/return`,
      cancel_url: `${siteUrl}${prefix}/carrito`,
      locale: locale === "en" ? "en-GB" : "es-ES",
    },
  };

  const res = await fetch(`${paypalBaseUrl()}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("[PAYPAL CREATE]", err);
    throw new Error("Error al crear pedido PayPal");
  }

  const data = (await res.json()) as {
    id: string;
    links: { rel: string; href: string }[];
  };

  const approval = data.links.find((l) => l.rel === "approve");
  if (!approval) throw new Error("PayPal approval URL missing");

  return { orderId: data.id, approvalUrl: approval.href };
}

export type PayPalCaptureResult = {
  status: string;
  payerEmail?: string;
  payerName?: string;
  totalCents: number;
  itemsSummary?: string;
};

export async function capturePayPalOrder(orderId: string): Promise<PayPalCaptureResult> {
  const token = await getAccessToken();
  const res = await fetch(`${paypalBaseUrl()}/v2/checkout/orders/${orderId}/capture`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("[PAYPAL CAPTURE]", err);
    throw new Error("Error al capturar pago PayPal");
  }

  const data = (await res.json()) as {
    status: string;
    payer?: {
      email_address?: string;
      name?: { given_name?: string; surname?: string };
    };
    purchase_units?: {
      amount?: { value?: string };
      items?: { name?: string; quantity?: string }[];
    }[];
  };

  const unit = data.purchase_units?.[0];
  const payerName = [data.payer?.name?.given_name, data.payer?.name?.surname]
    .filter(Boolean)
    .join(" ");
  const itemsSummary = unit?.items
    ?.map((item) => `${item.name || "Producto"} × ${item.quantity || "1"}`)
    .join(", ");

  return {
    status: data.status,
    payerEmail: data.payer?.email_address,
    payerName: payerName || undefined,
    totalCents: Math.round(parseFloat(unit?.amount?.value || "0") * 100),
    itemsSummary: itemsSummary || undefined,
  };
}
