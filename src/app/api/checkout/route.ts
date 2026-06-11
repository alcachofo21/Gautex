import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

export async function POST(request: Request) {
  try {
    const stripe = getStripe();
    if (!stripe) {
      return NextResponse.json(
        { error: "Stripe no configurado. Use solicitud de presupuesto." },
        { status: 400 }
      );
    }

    const { items } = await request.json();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const lineItems = items.map((item: { name: string; quantity: number; priceLabel: string }) => ({
      price_data: {
        currency: "eur",
        product_data: {
          name: item.name,
          description: item.priceLabel,
        },
        unit_amount: 1000,
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      success_url: `${siteUrl}/checkout?success=true`,
      cancel_url: `${siteUrl}/carrito`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("[GAUTEX CHECKOUT]", error);
    return NextResponse.json({ error: "Error al crear sesión" }, { status: 500 });
  }
}
