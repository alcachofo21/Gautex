import { describe, it, expect, vi, beforeEach } from "vitest";

const { sendMail, createTransport } = vi.hoisted(() => {
  const sendMail = vi.fn().mockResolvedValue({ messageId: "test" });
  const createTransport = vi.fn(() => ({ sendMail }));
  return { sendMail, createTransport };
});

vi.mock("nodemailer", () => ({
  default: { createTransport },
}));

import { sendUserConfirmation } from "@/lib/email";

describe("sendUserConfirmation", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    delete process.env.SMTP_HOST;
    delete process.env.SMTP_USER;
    delete process.env.SMTP_PASS;
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), { status: 200 })
    );
    vi.stubEnv("RESEND_API_KEY", "re_test");
  });

  it("sends confirmation email via Resend", async () => {
    await sendUserConfirmation("user@test.com", "es", "contact", "Juan");
    expect(globalThis.fetch).toHaveBeenCalledWith(
      "https://api.resend.com/emails",
      expect.objectContaining({ method: "POST" })
    );
  });

  it("sends via SMTP when configured", async () => {
    vi.stubEnv("EMAIL_TRANSPORT", "smtp");
    vi.stubEnv("SMTP_HOST", "smtp.serviciodecorreo.es");
    vi.stubEnv("SMTP_USER", "info@gautex.com");
    vi.stubEnv("SMTP_PASS", "secret");

    await sendUserConfirmation("user@test.com", "en", "campaign", "John");

    expect(sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "user@test.com",
        subject: expect.stringContaining("Campaign"),
      })
    );
  });

  it("adds unsubscribe header for newsletter confirmations", async () => {
    await sendUserConfirmation("user@test.com", "es", "newsletter", "Ana");

    expect(globalThis.fetch).toHaveBeenCalledWith(
      "https://api.resend.com/emails",
      expect.objectContaining({
        body: expect.stringContaining("List-Unsubscribe"),
      })
    );
  });
});
