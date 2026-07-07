import { describe, it, expect, beforeEach, vi } from "vitest";
import { POST } from "@/app/api/contact/route";
import { createApiRequest, validContactBody } from "@/test-helpers/api";
import { resetRateLimitBuckets } from "@/lib/rate-limit";
import { sendEmail, sendUserConfirmation } from "@/lib/email";

vi.mock("@/lib/email", () => ({
  sendEmail: vi.fn().mockResolvedValue({ ok: true }),
  contactEmailHtml: vi.fn().mockReturnValue("<p>html</p>"),
  sendUserConfirmation: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("@/lib/crm", () => ({
  notifyCrm: vi.fn().mockResolvedValue(undefined),
}));

describe("POST /api/contact", () => {
  beforeEach(() => {
    resetRateLimitBuckets();
    vi.mocked(sendEmail).mockResolvedValue({ ok: true });
    vi.mocked(sendUserConfirmation).mockResolvedValue(undefined);
  });

  it("returns success for valid contact", async () => {
    const res = await POST(
      createApiRequest("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validContactBody),
      })
    );
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
  });

  it("returns 400 for invalid data", async () => {
    const res = await POST(
      createApiRequest("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName: "A" }),
      })
    );
    expect(res.status).toBe(400);
  });

  it("returns 403 for wrong origin", async () => {
    const res = await POST(
      new Request("http://localhost:3000/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          origin: "https://evil.com",
        },
        body: JSON.stringify(validContactBody),
      })
    );
    expect(res.status).toBe(403);
  });

  it("silently accepts honeypot", async () => {
    const res = await POST(
      createApiRequest("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...validContactBody, website: "spam-bot" }),
      })
    );
    expect(res.status).toBe(200);
  });

  it("returns 429 when rate limited", async () => {
    for (let i = 0; i < 11; i++) {
      await POST(
        createApiRequest("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-forwarded-for": "1.2.3.4" },
          body: JSON.stringify(validContactBody),
        })
      );
    }
    const res = await POST(
      createApiRequest("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-forwarded-for": "1.2.3.4" },
        body: JSON.stringify(validContactBody),
      })
    );
    expect(res.status).toBe(429);
  });

  it("returns 502 when email fails", async () => {
    vi.mocked(sendEmail).mockResolvedValueOnce({ ok: false, error: "fail" });
    const res = await POST(
      createApiRequest("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validContactBody),
      })
    );
    expect(res.status).toBe(502);
  });

  it("returns 500 on unexpected error", async () => {
    vi.mocked(sendEmail).mockRejectedValueOnce(new Error("boom"));
    const res = await POST(
      createApiRequest("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validContactBody),
      })
    );
    expect(res.status).toBe(500);
  });

  it("handles newsletter type", async () => {
    const res = await POST(
      createApiRequest("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...validContactBody, type: "newsletter" }),
      })
    );
    expect(res.status).toBe(200);
    expect(sendUserConfirmation).toHaveBeenCalledWith(
      validContactBody.email,
      "es",
      "newsletter",
      validContactBody.firstName
    );
  });

  it("returns 413 for oversized body", async () => {
    const res = await POST(
      createApiRequest("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "content-length": String(200 * 1024),
        },
        body: JSON.stringify(validContactBody),
      })
    );
    expect(res.status).toBe(413);
  });
});
