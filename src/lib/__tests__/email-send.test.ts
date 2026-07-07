import { describe, it, expect, beforeEach, vi } from "vitest";

const { sendMail, createTransport } = vi.hoisted(() => {
  const sendMail = vi.fn().mockResolvedValue({ messageId: "test" });
  const createTransport = vi.fn(() => ({ sendMail }));
  return { sendMail, createTransport };
});

vi.mock("nodemailer", () => ({
  default: { createTransport },
}));

import { sendEmail, sendPurchaseEmails } from "@/lib/email";

describe("sendEmail", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    vi.clearAllMocks();
    sendMail.mockResolvedValue({ messageId: "test" });
    createTransport.mockReturnValue({ sendMail });
  });

  it("returns ok without transport in test env", async () => {
    delete process.env.SMTP_HOST;
    delete process.env.RESEND_API_KEY;
    process.env.NODE_ENV = "test";

    const result = await sendEmail({
      subject: "Test",
      html: "<p>Hi</p>",
      text: "Hi",
    });

    expect(result.ok).toBe(true);
    expect(createTransport).not.toHaveBeenCalled();
  });

  it("sends via SMTP when configured", async () => {
    vi.stubEnv("SMTP_HOST", "smtp.serviciodecorreo.es");
    vi.stubEnv("SMTP_USER", "info@gautex.com");
    vi.stubEnv("SMTP_PASS", "secret");
    vi.stubEnv("SMTP_FROM", "Gautex <info@gautex.com>");

    const result = await sendEmail({
      subject: "Test",
      html: "<p>Hi</p>",
      text: "Hi",
    });

    expect(result.ok).toBe(true);
    expect(createTransport).toHaveBeenCalled();
    expect(sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        from: "Gautex <info@gautex.com>",
        subject: "Test",
      })
    );
  });

  it("prefers Resend over SMTP in auto mode when both are set", async () => {
    vi.stubEnv("SMTP_HOST", "smtp.serviciodecorreo.es");
    vi.stubEnv("SMTP_USER", "info@gautex.com");
    vi.stubEnv("SMTP_PASS", "secret");
    vi.stubEnv("RESEND_API_KEY", "re_test_key");
    globalThis.fetch = vi.fn().mockResolvedValue(new Response("{}", { status: 200 }));

    await sendEmail({ subject: "Test", html: "<p>Hi</p>", text: "Hi" });

    expect(globalThis.fetch).toHaveBeenCalled();
    expect(sendMail).not.toHaveBeenCalled();
  });

  it("uses SMTP when EMAIL_TRANSPORT=smtp", async () => {
    vi.stubEnv("EMAIL_TRANSPORT", "smtp");
    vi.stubEnv("SMTP_HOST", "smtp.serviciodecorreo.es");
    vi.stubEnv("SMTP_USER", "info@gautex.com");
    vi.stubEnv("SMTP_PASS", "secret");
    vi.stubEnv("RESEND_API_KEY", "re_test_key");
    globalThis.fetch = vi.fn();

    await sendEmail({ subject: "Test", html: "<p>Hi</p>", text: "Hi" });

    expect(sendMail).toHaveBeenCalled();
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  it("returns error on SMTP failure", async () => {
    vi.stubEnv("SMTP_HOST", "smtp.serviciodecorreo.es");
    vi.stubEnv("SMTP_USER", "info@gautex.com");
    vi.stubEnv("SMTP_PASS", "secret");
    sendMail.mockRejectedValueOnce(new Error("SMTP auth failed"));

    const result = await sendEmail({
      subject: "Test",
      html: "<p>Hi</p>",
      text: "Hi",
    });

    expect(result.ok).toBe(false);
    expect(result.error).toBe("SMTP auth failed");
  });

  it("calls Resend API when only Resend key is set", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_test_key");
    globalThis.fetch = vi.fn().mockResolvedValue(new Response("{}", { status: 200 }));

    const result = await sendEmail({
      subject: "Test",
      html: "<p>Hi</p>",
      text: "Hi",
    });

    expect(result.ok).toBe(true);
    expect(globalThis.fetch).toHaveBeenCalledWith(
      "https://api.resend.com/emails",
      expect.objectContaining({ method: "POST" })
    );
  });

  it("warns in production without SMTP or Resend", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    delete process.env.SMTP_HOST;
    delete process.env.RESEND_API_KEY;
    process.env.NODE_ENV = "production";

    const result = await sendEmail({
      subject: "Test",
      html: "<p>Hi</p>",
      text: "Hi",
    });

    expect(result.ok).toBe(false);
    expect(result.error).toBe("Email no configurado");
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
    process.env.NODE_ENV = "test";
  });
});

describe("sendPurchaseEmails", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    vi.clearAllMocks();
    sendMail.mockResolvedValue({ messageId: "test" });
    createTransport.mockReturnValue({ sendMail });
    globalThis.fetch = vi.fn().mockResolvedValue(new Response("{}", { status: 200 }));
  });

  it("sends internal and customer confirmation emails", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_test");
    vi.stubEnv("CONTACT_EMAIL", "shop@gautex.com");

    const result = await sendPurchaseEmails({
      provider: "paypal",
      orderId: "ORDER123",
      locale: "es",
      totalCents: 2090,
      customerEmail: "buyer@test.com",
      customerName: "Ana",
      itemsSummary: "Preservativos Matrix × 1",
    });

    expect(result.ok).toBe(true);
    expect(globalThis.fetch).toHaveBeenCalledTimes(2);
    expect(globalThis.fetch).toHaveBeenCalledWith(
      "https://api.resend.com/emails",
      expect.objectContaining({
        body: expect.stringContaining("buyer@test.com"),
      })
    );
  });

  it("sends only internal email when customer email is missing", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_test");

    await sendPurchaseEmails({
      provider: "stripe",
      orderId: "cs_test",
      locale: "en",
      totalCents: 1000,
    });

    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
  });
});
