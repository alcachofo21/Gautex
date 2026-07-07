import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { fulfillStripeCheckoutSession } from "@/lib/payments/stripe-checkout";

export async function POST(request: Request) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !webhookSecret) {
    return NextResponse.json({ error: "Webhook no configurado" }, { status: 503 });
  }

  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Sin firma" }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("[STRIPE WEBHOOK]", err);
    return NextResponse.json({ error: "Firma inválida" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const result = await fulfillStripeCheckoutSession(session.id);

    if (!result.ok) {
      console.error("[STRIPE WEBHOOK] Email failed:", result.error);
      return NextResponse.json({ error: "Error al enviar email" }, { status: 502 });
    }
  }

  return NextResponse.json({ received: true });
}
