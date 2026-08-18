import { NextResponse } from "next/server";
import type { CartItem } from "@/types";
import {
  createPayPalOrder,
  createStripeCheckoutSession,
  getEnabledPaymentMethods,
  hasInstantCheckout,
  isPayPalConfigured,
  isStripeConfigured,
  priceCart,
} from "@/lib/payments";
import { rateLimit, clientIp, RATE_LIMIT_CHECKOUT } from "@/lib/rate-limit";
import { assertSameOrigin, readJsonBodyWithLimit } from "@/lib/api-guard";
import { checkoutSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const originError = assertSameOrigin(request);
    if (originError) return originError;

    const ip = clientIp(request);
    const limited = rateLimit(`checkout:${ip}`, RATE_LIMIT_CHECKOUT);
    if (!limited.ok) {
      return NextResponse.json({ error: "Demasiadas solicitudes" }, { status: 429 });
    }

    const parsedBody = await readJsonBodyWithLimit(request);
    if ("error" in parsedBody) return parsedBody.error;

    const parsed = checkoutSchema.safeParse(parsedBody.body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
    }

    const { items, locale, provider, customerEmail } = parsed.data;
    const loc = locale === "en" ? "en" : "es";

    const pricing = priceCart(items as CartItem[]);
    if (!pricing.payable) {
      return NextResponse.json(
        { error: "Algunos productos no tienen precio online. Use presupuesto B2B." },
        { status: 400 }
      );
    }

    if (provider === "stripe") {
      if (!isStripeConfigured()) {
        return NextResponse.json({ error: "Stripe no configurado" }, { status: 503 });
      }
      const session = await createStripeCheckoutSession({
        pricing,
        locale: loc,
        customerEmail: customerEmail || undefined,
      });
      return NextResponse.json({ url: session.url });
    }

    if (!isPayPalConfigured()) {
      return NextResponse.json({ error: "PayPal no configurado" }, { status: 503 });
    }
    const { approvalUrl } = await createPayPalOrder(pricing, loc);
    return NextResponse.json({ url: approvalUrl });
  } catch (error) {
    console.error("[GAUTEX CHECKOUT]", error);
    const msg = error instanceof Error ? error.message : "Error al crear el pago";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const locale = new URL(request.url).searchParams.get("locale") === "en" ? "en" : "es";
  const itemsParam = new URL(request.url).searchParams.get("items");

  let pricing = { payable: false, unpublishable: [] as string[], totalCents: 0 };
  if (itemsParam) {
    try {
      const items = JSON.parse(itemsParam) as CartItem[];
      const p = priceCart(items);
      pricing = { payable: p.payable, unpublishable: p.unpublishable, totalCents: p.totalCents };
    } catch {
      /* ignore */
    }
  }

  return NextResponse.json({
    instantCheckoutEnabled: hasInstantCheckout(),
    methods: getEnabledPaymentMethods(locale),
    pricing,
  });
}
