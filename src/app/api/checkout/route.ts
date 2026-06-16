import { NextResponse } from "next/server";
import type { CartItem } from "@/types";
import {
  createStripeCheckoutSession,
  getEnabledPaymentMethods,
  hasInstantCheckout,
  getStripePaymentMethodTypes,
  priceCart,
} from "@/lib/payments";
import { rateLimit, clientIp } from "@/lib/rate-limit";

export async function POST(request: Request) {
  try {
    const ip = clientIp(request);
    const limited = rateLimit(`checkout:${ip}`, 5);
    if (!limited.ok) {
      return NextResponse.json({ error: "Demasiadas solicitudes" }, { status: 429 });
    }

    const { items, locale, customerEmail, provider = "stripe" } = await request.json();

    if (provider !== "stripe") {
      return NextResponse.json({ error: "Proveedor no soportado" }, { status: 400 });
    }

    const pricing = priceCart(items as CartItem[]);
    if (!pricing.payable) {
      return NextResponse.json(
        { error: "Algunos productos no tienen precio online. Use presupuesto B2B." },
        { status: 400 }
      );
    }

    const session = await createStripeCheckoutSession({
      pricing,
      locale: locale === "en" ? "en" : "es",
      customerEmail,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("[GAUTEX CHECKOUT]", error);
    const msg = error instanceof Error ? error.message : "Error al crear sesión";
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
    paymentMethodTypes: getStripePaymentMethodTypes(),
    pricing,
  });
}
