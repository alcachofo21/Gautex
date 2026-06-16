type EmailPayload = {
  subject: string;
  html: string;
  text: string;
  to?: string | string[];
};

export async function sendEmail(payload: EmailPayload): Promise<{ ok: boolean; error?: string }> {
  const resendKey = process.env.RESEND_API_KEY;
  const contactEmail = process.env.CONTACT_EMAIL || "info@gautex.com";
  const fromEmail = process.env.RESEND_FROM || "Gautex Web <onboarding@resend.dev>";
  const recipients = payload.to ?? contactEmail;

  console.log("[GAUTEX EMAIL]", payload.subject, payload.text);

  if (!resendKey) {
    if (process.env.NODE_ENV === "production") {
      console.warn("[GAUTEX EMAIL] RESEND_API_KEY missing in production");
    }
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
        to: recipients,
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
    ${data.configOptionsSummary ? `<p><strong>Opciones:</strong> ${data.configOptionsSummary}</p>` : ""}
    ${data.quantity ? `<p><strong>Cantidad:</strong> ${data.quantity}</p>` : ""}
    ${data.logoUrl ? `<p><strong>Logo:</strong> <a href="${data.logoUrl}">${data.logoFileName || data.logoUrl}</a></p>` : ""}
    ${data.foilFrontUrl ? `<p><strong>Foil frontal:</strong> <a href="${data.foilFrontUrl}">${data.foilFrontFileName || data.foilFrontUrl}</a></p>` : ""}
    ${data.foilBackUrl ? `<p><strong>Foil reverso:</strong> <a href="${data.foilBackUrl}">${data.foilBackFileName || data.foilBackUrl}</a></p>` : ""}
    ${items ? `<p><strong>Productos:</strong></p><ul>${items}</ul>` : ""}
    <p><strong>Mensaje:</strong></p>
    <p>${String(data.message || "—").replace(/\n/g, "<br>")}</p>
  `;
}

export function userConfirmationHtml(
  locale: "es" | "en",
  kind: "contact" | "quote" | "newsletter" | "campaign",
  name: string
): string {
  const copy = {
    es: {
      contact: "Hemos recibido tu mensaje. Te responderemos en 24–48h laborables.",
      quote: "Hemos recibido tu solicitud de presupuesto. Nuestro equipo comercial te contactará pronto.",
      newsletter: "Gracias por suscribirte a nuestro newsletter.",
      campaign: "Hemos recibido tu solicitud de campaña personalizada. Te contactaremos para revisar el diseño.",
      greeting: "Hola",
      footer: "Gautex Medica — Repartiendo salud",
    },
    en: {
      contact: "We have received your message. We will reply within 24–48 business hours.",
      quote: "We have received your quote request. Our sales team will contact you shortly.",
      newsletter: "Thank you for subscribing to our newsletter.",
      campaign: "We have received your custom campaign request. We will contact you to review the design.",
      greeting: "Hello",
      footer: "Gautex Medica — Spreading health",
    },
  }[locale];

  return `
    <h2>${copy.greeting} ${name},</h2>
    <p>${copy[kind]}</p>
    <p style="margin-top:24px;color:#64748b;font-size:14px;">${copy.footer}</p>
  `;
}

export async function sendUserConfirmation(
  email: string,
  locale: "es" | "en",
  kind: "contact" | "quote" | "newsletter" | "campaign",
  name: string
): Promise<void> {
  const subjects = {
    es: {
      contact: "Confirmación de contacto — Gautex Medica",
      quote: "Confirmación de presupuesto — Gautex Medica",
      newsletter: "Suscripción confirmada — Gautex Medica",
      campaign: "Confirmación de campaña — Gautex Medica",
    },
    en: {
      contact: "Contact confirmation — Gautex Medica",
      quote: "Quote request confirmation — Gautex Medica",
      newsletter: "Subscription confirmed — Gautex Medica",
      campaign: "Campaign request confirmation — Gautex Medica",
    },
  };

  await sendEmail({
    to: email,
    subject: subjects[locale][kind],
    html: userConfirmationHtml(locale, kind, name),
    text: userConfirmationHtml(locale, kind, name).replace(/<[^>]+>/g, " "),
  });
}
