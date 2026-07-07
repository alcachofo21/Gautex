import { describe, it, expect, beforeEach, vi } from "vitest";
import { POST } from "@/app/api/quote/route";
import { createApiRequest, validQuoteBody } from "@/test-helpers/api";
import { resetRateLimitBuckets } from "@/lib/rate-limit";
import { sendEmail } from "@/lib/email";

vi.mock("@/lib/email", () => ({
  sendEmail: vi.fn().mockResolvedValue({ ok: true }),
  quoteEmailHtml: vi.fn().mockReturnValue("<p>html</p>"),
  sendUserConfirmation: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("@/lib/crm", () => ({
  notifyCrm: vi.fn().mockResolvedValue(undefined),
}));

describe("POST /api/quote", () => {
  beforeEach(() => {
    resetRateLimitBuckets();
    vi.mocked(sendEmail).mockClear();
    vi.mocked(sendEmail).mockResolvedValue({ ok: true });
  });

  it("returns success for valid quote", async () => {
    const res = await POST(
      createApiRequest("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validQuoteBody),
      })
    );
    expect(res.status).toBe(200);
  });

  it("returns success for campaign quote", async () => {
    const res = await POST(
      createApiRequest("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...validQuoteBody, type: "campaign", formatName: "Estuche" }),
      })
    );
    expect(res.status).toBe(200);
  });

  it("returns 400 for invalid data", async () => {
    const res = await POST(
      createApiRequest("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "cart" }),
      })
    );
    expect(res.status).toBe(400);
  });

  it("returns 403 for wrong origin", async () => {
    const res = await POST(
      new Request("http://localhost:3000/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json", origin: "https://evil.com" },
        body: JSON.stringify(validQuoteBody),
      })
    );
    expect(res.status).toBe(403);
  });

  it("silently accepts honeypot", async () => {
    const res = await POST(
      createApiRequest("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...validQuoteBody, website: "bot" }),
      })
    );
    expect(res.status).toBe(200);
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("returns 429 when rate limited", async () => {
    for (let i = 0; i < 11; i++) {
      await POST(
        createApiRequest("/api/quote", {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-forwarded-for": "9.9.9.9" },
          body: JSON.stringify(validQuoteBody),
        })
      );
    }
    const res = await POST(
      createApiRequest("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-forwarded-for": "9.9.9.9" },
        body: JSON.stringify(validQuoteBody),
      })
    );
    expect(res.status).toBe(429);
  });

  it("returns 502 when email fails", async () => {
    vi.mocked(sendEmail).mockResolvedValueOnce({ ok: false });
    const res = await POST(
      createApiRequest("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validQuoteBody),
      })
    );
    expect(res.status).toBe(502);
  });

  it("returns 500 on unexpected error", async () => {
    vi.mocked(sendEmail).mockRejectedValueOnce(new Error("boom"));
    const res = await POST(
      createApiRequest("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validQuoteBody),
      })
    );
    expect(res.status).toBe(500);
  });
});
