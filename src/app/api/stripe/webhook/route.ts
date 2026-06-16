import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { sendEmail } from "@/lib/email";

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
    await sendEmail({
      subject: `[Gautex] Pago Stripe completado — ${session.id}`,
      html: `<p>Pago recibido vía Stripe Checkout.</p>
        <p>Session: ${session.id}</p>
        <p>Email: ${session.customer_details?.email || "—"}</p>
        <p>Total: ${((session.amount_total || 0) / 100).toFixed(2)} EUR</p>`,
      text: JSON.stringify(session.metadata, null, 2),
    });
  }

  return NextResponse.json({ received: true });
}
