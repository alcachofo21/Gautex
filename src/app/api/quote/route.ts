import { NextResponse } from "next/server";
import { quoteSchema } from "@/lib/validation";
import { sendEmail, quoteEmailHtml, sendUserConfirmation } from "@/lib/email";
import { notifyCrm } from "@/lib/crm";
import { rateLimit, clientIp } from "@/lib/rate-limit";

export async function POST(request: Request) {
  try {
    const ip = clientIp(request);
    const limited = rateLimit(`quote:${ip}`);
    if (!limited.ok) {
      return NextResponse.json({ error: "Demasiadas solicitudes" }, { status: 429 });
    }

    const body = await request.json();
    const parsed = quoteSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
    }

    if (parsed.data.website) {
      return NextResponse.json({ success: true });
    }

    const locale = body.locale === "en" ? "en" : "es";
    const payload = {
      ...parsed.data,
      timestamp: new Date().toISOString(),
    };

    const result = await sendEmail({
      subject: `[Gautex] Presupuesto - ${parsed.data.firstName} ${parsed.data.lastName || ""}`,
      html: quoteEmailHtml(payload),
      text: JSON.stringify(payload, null, 2),
    });

    if (!result.ok) {
      return NextResponse.json({ error: "Error al enviar email" }, { status: 502 });
    }

    const kind = parsed.data.type === "campaign" ? "campaign" : "quote";
    await sendUserConfirmation(parsed.data.email, locale, kind, parsed.data.firstName);
    await notifyCrm(kind, payload);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
