import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/validation";
import { sendEmail, contactEmailHtml } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
    }

    if (parsed.data.website) {
      return NextResponse.json({ success: true });
    }

    const { firstName, lastName, email, phone, message, type } = parsed.data;
    const text = JSON.stringify({ firstName, lastName, email, phone, message, type }, null, 2);

    const result = await sendEmail({
      subject: `[Gautex] ${type === "newsletter" ? "Newsletter" : "Contacto"} - ${firstName} ${lastName}`,
      html: contactEmailHtml({ firstName, lastName, email, phone, message, type: type || "contact" }),
      text,
    });

    if (!result.ok) {
      return NextResponse.json({ error: "Error al enviar email" }, { status: 502 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
