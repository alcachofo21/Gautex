import { NextResponse } from "next/server";
import { quoteSchema } from "@/lib/validation";
import { sendEmail, quoteEmailHtml } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = quoteSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
    }

    if (parsed.data.website) {
      return NextResponse.json({ success: true });
    }

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

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
