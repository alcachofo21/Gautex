import { escapeHtml, escapeHtmlWithBreaks } from "@/lib/escape-html";

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

function esc(value: string | undefined, fallback = "—"): string {
  return escapeHtml(value || fallback);
}

export function contactEmailHtml(data: Record<string, string | undefined>): string {
  return `
    <h2>Nuevo mensaje — Gautex Web</h2>
    <p><strong>Nombre:</strong> ${esc(data.firstName)} ${esc(data.lastName)}</p>
    <p><strong>Email:</strong> ${esc(data.email)}</p>
    <p><strong>Teléfono:</strong> ${esc(data.phone)}</p>
    <p><strong>Tipo:</strong> ${esc(data.type, "contact")}</p>
    <p><strong>Mensaje:</strong></p>
    <p>${escapeHtmlWithBreaks(data.message || "")}</p>
  `;
}

export function quoteEmailHtml(data: Record<string, unknown>): string {
  const items = Array.isArray(data.items)
    ? (data.items as { name: string; quantity: number; priceLabel: string }[])
        .map(
          (i) =>
            `<li>${esc(i.name)} × ${escapeHtml(String(i.quantity))} (${esc(i.priceLabel)})</li>`
        )
        .join("")
    : "";

  const urlField = (label: string, url: unknown, fileName: unknown) =>
    url
      ? `<p><strong>${label}:</strong> <a href="${esc(String(url))}">${esc(String(fileName || url))}</a></p>`
      : "";

  return `
    <h2>Solicitud de presupuesto — Gautex Web</h2>
    <p><strong>Tipo:</strong> ${esc(String(data.type ?? ""))}</p>
    <p><strong>Cliente:</strong> ${esc(String(data.firstName ?? ""))} ${esc(String(data.lastName ?? ""))}</p>
    <p><strong>Email:</strong> ${esc(String(data.email ?? ""))}</p>
    <p><strong>Teléfono:</strong> ${esc(String(data.phone ?? ""))}</p>
    <p><strong>Empresa:</strong> ${esc(String(data.company ?? ""))}</p>
    <p><strong>CIF:</strong> ${esc(String(data.cif ?? ""))}</p>
    <p><strong>Sector:</strong> ${esc(String(data.sector ?? ""))}</p>
    ${data.formatName ? `<p><strong>Formato campaña:</strong> ${esc(String(data.formatName))}</p>` : ""}
    ${data.configOptionsSummary ? `<p><strong>Opciones:</strong> ${esc(String(data.configOptionsSummary))}</p>` : ""}
    ${data.quantity ? `<p><strong>Cantidad:</strong> ${esc(String(data.quantity))}</p>` : ""}
    ${urlField("Logo", data.logoUrl, data.logoFileName)}
    ${urlField("Foil frontal", data.foilFrontUrl, data.foilFrontFileName)}
    ${urlField("Foil reverso", data.foilBackUrl, data.foilBackFileName)}
    ${items ? `<p><strong>Productos:</strong></p><ul>${items}</ul>` : ""}
    <p><strong>Mensaje:</strong></p>
    <p>${escapeHtmlWithBreaks(String(data.message || "—"))}</p>
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
    <h2>${escapeHtml(copy.greeting)} ${escapeHtml(name)},</h2>
    <p>${escapeHtml(copy[kind])}</p>
    <p style="margin-top:24px;color:#64748b;font-size:14px;">${escapeHtml(copy.footer)}</p>
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
