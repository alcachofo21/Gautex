import { describe, it, expect, beforeEach, vi } from "vitest";
import { sendEmail } from "@/lib/email";

describe("sendEmail", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns ok without API key in test env", async () => {
    delete process.env.RESEND_API_KEY;
    process.env.NODE_ENV = "test";
    const result = await sendEmail({
      subject: "Test",
      html: "<p>Hi</p>",
      text: "Hi",
    });
    expect(result.ok).toBe(true);
  });

  it("calls Resend API when key is set", async () => {
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

  it("returns error on Resend failure", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_test_key");
    globalThis.fetch = vi.fn().mockResolvedValue(new Response("fail", { status: 500 }));

    const result = await sendEmail({
      subject: "Test",
      html: "<p>Hi</p>",
      text: "Hi",
    });

    expect(result.ok).toBe(false);
  });

  it("warns in production without API key", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    delete process.env.RESEND_API_KEY;
    process.env.NODE_ENV = "production";

    const result = await sendEmail({
      subject: "Test",
      html: "<p>Hi</p>",
      text: "Hi",
    });

    expect(result.ok).toBe(true);
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
    process.env.NODE_ENV = "test";
  });

  it("handles network errors", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_test_key");
    globalThis.fetch = vi.fn().mockRejectedValue(new Error("network down"));

    const result = await sendEmail({
      subject: "Test",
      html: "<p>Hi</p>",
      text: "Hi",
    });

    expect(result.ok).toBe(false);
    expect(result.error).toBe("network down");
  });
});
