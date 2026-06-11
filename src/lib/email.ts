type EmailPayload = {
  subject: string;
  html: string;
  text: string;
};

export async function sendEmail(payload: EmailPayload): Promise<{ ok: boolean; error?: string }> {
  const resendKey = process.env.RESEND_API_KEY;
  const contactEmail = process.env.CONTACT_EMAIL || "info@gautex.com";
  const fromEmail = process.env.RESEND_FROM || "Gautex Web <onboarding@resend.dev>";

  console.log("[GAUTEX EMAIL]", payload.subject, payload.text);

  if (!resendKey) {
    return { ok: true };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: contactEmail,
        subject: payload.subject,
        html: payload.html,
        text: payload.text,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("[GAUTEX EMAIL ERROR]", err);
      return { ok: false, error: err };
    }

    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    console.error("[GAUTEX EMAIL ERROR]", msg);
    return { ok: false, error: msg };
  }
}

export function contactEmailHtml(data: Record<string, string | undefined>): string {
  return `
    <h2>Nuevo mensaje — Gautex Web</h2>
    <p><strong>Nombre:</strong> ${data.firstName} ${data.lastName}</p>
    <p><strong>Email:</strong> ${data.email}</p>
    <p><strong>Teléfono:</strong> ${data.phone || "—"}</p>
    <p><strong>Tipo:</strong> ${data.type || "contact"}</p>
    <p><strong>Mensaje:</strong></p>
    <p>${(data.message || "").replace(/\n/g, "<br>")}</p>
  `;
}

export function quoteEmailHtml(data: Record<string, unknown>): string {
  const items = Array.isArray(data.items)
    ? (data.items as { name: string; quantity: number; priceLabel: string }[])
        .map((i) => `<li>${i.name} × ${i.quantity} (${i.priceLabel})</li>`)
        .join("")
    : "";

  return `
    <h2>Solicitud de presupuesto — Gautex Web</h2>
    <p><strong>Tipo:</strong> ${data.type}</p>
    <p><strong>Cliente:</strong> ${data.firstName} ${data.lastName || ""}</p>
    <p><strong>Email:</strong> ${data.email}</p>
    <p><strong>Teléfono:</strong> ${data.phone || "—"}</p>
    <p><strong>Empresa:</strong> ${data.company || "—"}</p>
    <p><strong>CIF:</strong> ${data.cif || "—"}</p>
    <p><strong>Sector:</strong> ${data.sector || "—"}</p>
    ${data.formatName ? `<p><strong>Formato campaña:</strong> ${data.formatName}</p>` : ""}
    ${data.quantity ? `<p><strong>Cantidad:</strong> ${data.quantity}</p>` : ""}
    ${data.logoUrl ? `<p><strong>Logo:</strong> <a href="${data.logoUrl}">${data.logoFileName || data.logoUrl}</a></p>` : ""}
    ${items ? `<p><strong>Productos:</strong></p><ul>${items}</ul>` : ""}
    <p><strong>Mensaje:</strong></p>
    <p>${String(data.message || "—").replace(/\n/g, "<br>")}</p>
  `;
}
