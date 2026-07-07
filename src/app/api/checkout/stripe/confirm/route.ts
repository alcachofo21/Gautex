import { NextResponse } from "next/server";
import { z } from "zod";
import { fulfillStripeCheckoutSession } from "@/lib/payments/stripe-checkout";
import { assertSameOrigin, readJsonBodyWithLimit } from "@/lib/api-guard";

const confirmSchema = z.object({
  sessionId: z.string().min(1).max(200),
});

export async function POST(request: Request) {
  try {
    const originError = assertSameOrigin(request);
    if (originError) return originError;

    const parsedBody = await readJsonBodyWithLimit(request);
    if ("error" in parsedBody) return parsedBody.error;

    const parsed = confirmSchema.safeParse(parsedBody.body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
    }

    const result = await fulfillStripeCheckoutSession(parsed.data.sessionId);
    if (!result.ok) {
      return NextResponse.json({ error: result.error || "Error al enviar email" }, { status: 502 });
    }

    return NextResponse.json({ success: true, alreadySent: result.alreadySent ?? false });
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
