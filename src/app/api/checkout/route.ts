import { NextResponse } from "next/server";
import { products } from "@/lib/products";
import { getStripe } from "@/lib/stripe";
import { rateLimit, clientIp } from "@/lib/rate-limit";
import { absoluteUrl } from "@/lib/site";

export async function POST(request: Request) {
  try {
    const ip = clientIp(request);
    const limited = rateLimit(`checkout:${ip}`, 5);
    if (!limited.ok) {
      return NextResponse.json({ error: "Demasiadas solicitudes" }, { status: 429 });
    }

    const stripe = getStripe();
    if (!stripe) {
      return NextResponse.json(
        { error: "Stripe no configurado. Use solicitud de presupuesto." },
        { status: 400 }
      );
    }

    const { items, locale } = await request.json();
    const prefix = locale === "en" ? "/en" : "";

    const lineItems = items.map((item: { productId: string; name: string; quantity: number; priceLabel: string }) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product?.price) {
        throw new Error(`Producto sin precio: ${item.name}`);
      }
      return {
        price_data: {
          currency: "eur",
          product_data: {
            name: item.name,
            description: item.priceLabel,
          },
          unit_amount: Math.round(product.price * 100),
        },
        quantity: item.quantity,
      };
    });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      success_url: absoluteUrl(`${prefix}/checkout?success=true`),
      cancel_url: absoluteUrl(`${prefix}/carrito`),
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("[GAUTEX CHECKOUT]", error);
    const msg = error instanceof Error ? error.message : "Error al crear sesión";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
