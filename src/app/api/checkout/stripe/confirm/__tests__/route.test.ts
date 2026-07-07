import { describe, it, expect, beforeEach, vi } from "vitest";
import { POST } from "@/app/api/checkout/stripe/confirm/route";
import { fulfillStripeCheckoutSession } from "@/lib/payments/stripe-checkout";
import { createApiRequest } from "@/test-helpers/api";

vi.mock("@/lib/payments/stripe-checkout", () => ({
  fulfillStripeCheckoutSession: vi.fn().mockResolvedValue({ ok: true }),
}));

describe("POST /api/checkout/stripe/confirm", () => {
  beforeEach(() => {
    vi.mocked(fulfillStripeCheckoutSession).mockResolvedValue({ ok: true });
  });

  it("confirms a stripe session", async () => {
    const res = await POST(
      createApiRequest("/api/checkout/stripe/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: "cs_test" }),
      })
    );
    expect(res.status).toBe(200);
    expect(fulfillStripeCheckoutSession).toHaveBeenCalledWith("cs_test");
  });

  it("returns 400 for invalid body", async () => {
    const res = await POST(
      createApiRequest("/api/checkout/stripe/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      })
    );
    expect(res.status).toBe(400);
  });

  it("returns 502 when fulfillment fails", async () => {
    vi.mocked(fulfillStripeCheckoutSession).mockResolvedValueOnce({
      ok: false,
      error: "SMTP down",
    });
    const res = await POST(
      createApiRequest("/api/checkout/stripe/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: "cs_test" }),
      })
    );
    expect(res.status).toBe(502);
  });

  it("returns 500 on unexpected error", async () => {
    vi.mocked(fulfillStripeCheckoutSession).mockRejectedValueOnce(new Error("boom"));
    const res = await POST(
      createApiRequest("/api/checkout/stripe/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: "cs_test" }),
      })
    );
    expect(res.status).toBe(500);
  });
});
