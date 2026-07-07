import nodemailer from "nodemailer";
import { escapeHtml, escapeHtmlWithBreaks } from "@/lib/escape-html";
import { formatEur } from "@/lib/payments/config";

type EmailPayload = {
  subject: string;
  html: string;
  text: string;
  to?: string | string[];
  replyTo?: string;
  headers?: Record<string, string>;
};

const COMPANY_ADDRESS =
  "Gautex Médica, S.L. · Calle Mallorca 1-23, Planta 2, Despacho 9 · 08014 Barcelona";

function companyReplyEmail(): string {
  return process.env.REPLY_TO_EMAIL || process.env.CONTACT_EMAIL || "info@gautex.com";
}

function wrapEmailHtml(title: string, bodyHtml: string, footerText: string): string {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;padding:32px;">
          <tr><td style="font-size:16px;line-height:1.6;">${bodyHtml}</td></tr>
          <tr><td style="padding-top:24px;border-top:1px solid #e2e8f0;color:#64748b;font-size:12px;line-height:1.5;">
            ${escapeHtml(footerText)}<br />
            ${escapeHtml(COMPANY_ADDRESS)} · ${escapeHtml(companyReplyEmail())}
          </td></tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function getFromAddress(transport: "resend" | "smtp" | null): string {
  if (transport === "resend" && process.env.RESEND_FROM) {
    return process.env.RESEND_FROM;
  }
  if (transport === "smtp" && process.env.SMTP_FROM) {
    return process.env.SMTP_FROM;
  }
  return (
    process.env.RESEND_FROM ||
    process.env.SMTP_FROM ||
    `Gautex Medica <${process.env.SMTP_USER || process.env.CONTACT_EMAIL || "info@gautex.com"}>`
  );
}

function getSmtpTransport() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) return null;

  const port = Number(process.env.SMTP_PORT || 465);
  const secure = process.env.SMTP_SECURE === "true" || (process.env.SMTP_SECURE !== "false" && port === 465);

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });
}

async function sendViaSmtp(
  payload: EmailPayload,
  from: string,
  to: string | string[]
): Promise<{ ok: boolean; error?: string }> {
  const transport = getSmtpTransport();
  if (!transport) {
    return { ok: false, error: "SMTP no configurado" };
  }

  try {
    await transport.sendMail({
      from,
      to,
      replyTo: payload.replyTo,
      subject: payload.subject,
      html: payload.html,
      text: payload.text,
      headers: payload.headers,
    });
    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    console.error("[GAUTEX EMAIL SMTP ERROR]", msg);
    return { ok: false, error: msg };
  }
}

async function sendViaResend(
  payload: EmailPayload,
  from: string,
  to: string | string[]
): Promise<{ ok: boolean; error?: string }> {
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    return { ok: false, error: "RESEND_API_KEY missing" };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to,
        reply_to: payload.replyTo,
        subject: payload.subject,
        html: payload.html,
        text: payload.text,
        headers: payload.headers,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("[GAUTEX EMAIL RESEND ERROR]", err);
      return { ok: false, error: err };
    }

    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    console.error("[GAUTEX EMAIL RESEND ERROR]", msg);
    return { ok: false, error: msg };
  }
}

function hasSmtpConfig(): boolean {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

function hasResendConfig(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

/** resend = API HTTPS (Render free). smtp = Arsys (requiere Render Starter). auto = Resend si hay clave, si no SMTP. */
export function resolveEmailTransport(): "resend" | "smtp" | null {
  const mode = (process.env.EMAIL_TRANSPORT || "auto").toLowerCase();

  if (mode === "resend") {
    return hasResendConfig() ? "resend" : null;
  }
  if (mode === "smtp") {
    return hasSmtpConfig() ? "smtp" : null;
  }

  if (hasResendConfig()) return "resend";
  if (hasSmtpConfig()) return "smtp";
  return null;
}

export async function sendEmail(payload: EmailPayload): Promise<{ ok: boolean; error?: string }> {
  const contactEmail = process.env.CONTACT_EMAIL || "info@gautex.com";
  const recipients = payload.to ?? contactEmail;
  const transport = resolveEmailTransport();
  const fromEmail = getFromAddress(transport);

  console.log("[GAUTEX EMAIL]", payload.subject, payload.text);

  if (transport === "resend") {
    return sendViaResend(payload, fromEmail, recipients);
  }

  if (transport === "smtp") {
    return sendViaSmtp(payload, fromEmail, recipients);
  }

  if (process.env.NODE_ENV === "production") {
    console.warn("[GAUTEX EMAIL] Sin transporte de email (RESEND_API_KEY o SMTP)");
    return { ok: false, error: "Email no configurado" };
  }

  return { ok: true };
}

function esc(value: string | undefined, fallback = "-"): string {
  return escapeHtml(value || fallback);
}

export function contactEmailHtml(data: Record<string, string | undefined>): string {
  const body = `
    <h2 style="margin:0 0 16px;font-size:20px;">Nuevo mensaje - Gautex Web</h2>
    <p><strong>Nombre:</strong> ${esc(data.firstName)} ${esc(data.lastName)}</p>
    <p><strong>Email:</strong> ${esc(data.email)}</p>
    <p><strong>Teléfono:</strong> ${esc(data.phone)}</p>
    <p><strong>Tipo:</strong> ${esc(data.type, "contact")}</p>
    <p><strong>Mensaje:</strong></p>
    <p>${escapeHtmlWithBreaks(data.message || "")}</p>
  `;
  return wrapEmailHtml("Nuevo mensaje - Gautex Web", body, "Notificación automática del formulario web.");
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

  return wrapEmailHtml(
    "Solicitud de presupuesto - Gautex Web",
    `
    <h2 style="margin:0 0 16px;font-size:20px;">Solicitud de presupuesto - Gautex Web</h2>
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
    <p>${escapeHtmlWithBreaks(String(data.message || "-"))}</p>
  `,
    "Notificación automática del formulario web."
  );
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
      footer: "Gautex Medica - Repartiendo salud",
    },
    en: {
      contact: "We have received your message. We will reply within 24–48 business hours.",
      quote: "We have received your quote request. Our sales team will contact you shortly.",
      newsletter: "Thank you for subscribing to our newsletter.",
      campaign: "We have received your custom campaign request. We will contact you to review the design.",
      greeting: "Hello",
      footer: "Gautex Medica - Spreading health",
    },
  }[locale];

  return wrapEmailHtml(
    copy[kind],
    `
    <h2 style="margin:0 0 16px;font-size:20px;">${escapeHtml(copy.greeting)} ${escapeHtml(name)},</h2>
    <p>${escapeHtml(copy[kind])}</p>
  `,
    copy.footer
  );
}

export type PurchaseEmailDetails = {
  provider: "stripe" | "paypal";
  orderId: string;
  locale: "es" | "en";
  totalCents: number;
  customerEmail?: string;
  customerName?: string;
  itemsSummary?: string;
};

function purchaseCopy(locale: "es" | "en") {
  return {
    es: {
      providerLabel: { stripe: "Tarjeta (Stripe)", paypal: "PayPal" },
      internalTitle: "Nuevo pago completado - Gautex Web",
      customerTitle: "Confirmación de compra - Gautex Medica",
      greeting: "Hola",
      body: "Gracias por tu compra. Hemos recibido tu pago correctamente. Nuestro equipo procesará tu pedido y te contactará si necesitamos más información.",
      order: "Pedido",
      total: "Total",
      method: "Método de pago",
      products: "Productos",
      footer: "Gautex Medica - Repartiendo salud",
      customerFallback: "Cliente",
    },
    en: {
      providerLabel: { stripe: "Card (Stripe)", paypal: "PayPal" },
      internalTitle: "New payment completed - Gautex Web",
      customerTitle: "Purchase confirmation - Gautex Medica",
      greeting: "Hello",
      body: "Thank you for your purchase. We have received your payment. Our team will process your order and contact you if we need more information.",
      order: "Order",
      total: "Total",
      method: "Payment method",
      products: "Products",
      footer: "Gautex Medica - Spreading health",
      customerFallback: "Customer",
    },
  }[locale];
}

export function purchaseNotificationHtml(details: PurchaseEmailDetails): string {
  const copy = purchaseCopy(details.locale);
  const provider = copy.providerLabel[details.provider];
  const customer = esc(details.customerName || details.customerEmail || "-");
  const items = details.itemsSummary
    ? `<p><strong>${copy.products}:</strong> ${esc(details.itemsSummary)}</p>`
    : "";

  return wrapEmailHtml(
    copy.internalTitle,
    `
    <h2 style="margin:0 0 16px;font-size:20px;">${escapeHtml(copy.internalTitle)}</h2>
    <p><strong>${copy.order}:</strong> ${esc(details.orderId)}</p>
    <p><strong>${copy.method}:</strong> ${escapeHtml(provider)}</p>
    <p><strong>Email cliente:</strong> ${esc(details.customerEmail)}</p>
    <p><strong>Cliente:</strong> ${customer}</p>
    <p><strong>${copy.total}:</strong> ${escapeHtml(formatEur(details.totalCents, details.locale))}</p>
    ${items}
  `,
    "Notificación automática de pedido."
  );
}

export function purchaseConfirmationHtml(details: PurchaseEmailDetails): string {
  const copy = purchaseCopy(details.locale);
  const name = esc(details.customerName || copy.customerFallback);
  const provider = copy.providerLabel[details.provider];
  const items = details.itemsSummary
    ? `<p><strong>${copy.products}:</strong> ${esc(details.itemsSummary)}</p>`
    : "";

  return wrapEmailHtml(
    copy.customerTitle,
    `
    <h2 style="margin:0 0 16px;font-size:20px;">${escapeHtml(copy.greeting)} ${name},</h2>
    <p>${escapeHtml(copy.body)}</p>
    <p><strong>${copy.order}:</strong> ${esc(details.orderId)}</p>
    <p><strong>${copy.method}:</strong> ${escapeHtml(provider)}</p>
    <p><strong>${copy.total}:</strong> ${escapeHtml(formatEur(details.totalCents, details.locale))}</p>
    ${items}
  `,
    copy.footer
  );
}

export async function sendPurchaseEmails(
  details: PurchaseEmailDetails
): Promise<{ ok: boolean; error?: string }> {
  const copy = purchaseCopy(details.locale);
  const notification = await sendEmail({
    subject: `[Gautex] Pago ${details.provider} completado - ${details.orderId}`,
    html: purchaseNotificationHtml(details),
    replyTo: details.customerEmail,
    text: [
      copy.internalTitle,
      `${copy.order}: ${details.orderId}`,
      `Email: ${details.customerEmail || "-"}`,
      `${copy.total}: ${formatEur(details.totalCents, details.locale)}`,
      details.itemsSummary ? `${copy.products}: ${details.itemsSummary}` : "",
    ]
      .filter(Boolean)
      .join("\n"),
  });

  if (!notification.ok) {
    return notification;
  }

  if (!details.customerEmail) {
    return { ok: true };
  }

  const confirmation = await sendEmail({
    to: details.customerEmail,
    subject: copy.customerTitle,
    html: purchaseConfirmationHtml(details),
    replyTo: companyReplyEmail(),
    text: purchaseConfirmationHtml(details).replace(/<[^>]+>/g, " "),
  });

  if (!confirmation.ok) {
    console.error("[GAUTEX PURCHASE EMAIL] Confirmación al cliente falló:", confirmation.error);
  }

  return { ok: true };
}

export async function sendUserConfirmation(
  email: string,
  locale: "es" | "en",
  kind: "contact" | "quote" | "newsletter" | "campaign",
  name: string
): Promise<{ ok: boolean; error?: string }> {
  const subjects = {
    es: {
      contact: "Confirmación de contacto - Gautex Medica",
      quote: "Confirmación de presupuesto - Gautex Medica",
      newsletter: "Suscripción confirmada - Gautex Medica",
      campaign: "Confirmación de campaña - Gautex Medica",
    },
    en: {
      contact: "Contact confirmation - Gautex Medica",
      quote: "Quote request confirmation - Gautex Medica",
      newsletter: "Subscription confirmed - Gautex Medica",
      campaign: "Campaign request confirmation - Gautex Medica",
    },
  };

  const html = userConfirmationHtml(locale, kind, name);
  const text = [
    `${locale === "en" ? "Hello" : "Hola"} ${name},`,
    html.replace(/<[^>]+>/g, " "),
    COMPANY_ADDRESS,
    companyReplyEmail(),
  ].join("\n\n");

  return sendEmail({
    to: email,
    subject: subjects[locale][kind],
    html,
    text,
    replyTo: companyReplyEmail(),
    headers:
      kind === "newsletter"
        ? { "List-Unsubscribe": `<mailto:${companyReplyEmail()}?subject=unsubscribe>` }
        : undefined,
  });
}
