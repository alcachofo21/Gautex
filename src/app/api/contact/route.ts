import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, phone, message, type } = body;

    if (!email || !message) {
      return NextResponse.json({ error: "Campos requeridos" }, { status: 400 });
    }

    const payload = {
      type: type || "contact",
      firstName,
      lastName,
      email,
      phone,
      message,
      timestamp: new Date().toISOString(),
    };

    console.log("[GAUTEX CONTACT]", JSON.stringify(payload, null, 2));

    const resendKey = process.env.RESEND_API_KEY;
    const contactEmail = process.env.CONTACT_EMAIL || "info@gautex.com";

    if (resendKey) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Gautex Web <onboarding@resend.dev>",
          to: contactEmail,
          subject: `[Gautex] ${type === "newsletter" ? "Newsletter" : "Contacto"} - ${firstName} ${lastName}`,
          text: JSON.stringify(payload, null, 2),
        }),
      });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
