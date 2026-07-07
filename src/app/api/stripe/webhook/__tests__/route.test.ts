import { describe, it, expect, beforeEach, vi } from "vitest";
import { POST } from "@/app/api/stripe/webhook/route";
import { sendEmail } from "@/lib/email";
import { getStripe } from "@/lib/stripe";

const mockConstructEvent = vi.fn();

vi.mock("@/lib/stripe", () => ({
  getStripe: vi.fn(() => ({
    webhooks: { constructEvent: mockConstructEvent },
  })),
}));

vi.mock("@/lib/email", () => ({
  sendEmail: vi.fn().mockResolvedValue({ ok: true }),
}));

describe("POST /api/stripe/webhook", () => {
  beforeEach(() => {
    mockConstructEvent.mockReset();
    vi.mocked(getStripe).mockReturnValue({
      webhooks: { constructEvent: mockConstructEvent },
    } as never);
    vi.stubEnv("STRIPE_WEBHOOK_SECRET", "whsec_test");
  });

  it("returns 503 when stripe is not configured", async () => {
    vi.mocked(getStripe).mockReturnValueOnce(null);
    const res = await POST(
      new Request("http://localhost:3000/api/stripe/webhook", {
        method: "POST",
        body: "{}",
        headers: { "stripe-signature": "sig" },
      })
    );
    expect(res.status).toBe(503);
  });

  it("returns 503 without webhook secret", async () => {
    vi.unstubAllEnvs();
    delete process.env.STRIPE_WEBHOOK_SECRET;
    const res = await POST(
      new Request("http://localhost:3000/api/stripe/webhook", {
        method: "POST",
        body: "{}",
        headers: { "stripe-signature": "sig" },
      })
    );
    expect(res.status).toBe(503);
  });

  it("returns 400 without signature", async () => {
    const res = await POST(
      new Request("http://localhost:3000/api/stripe/webhook", {
        method: "POST",
        body: "{}",
      })
    );
    expect(res.status).toBe(400);
  });

  it("returns 400 for invalid signature", async () => {
    mockConstructEvent.mockImplementation(() => {
      throw new Error("Invalid signature");
    });
    const res = await POST(
      new Request("http://localhost:3000/api/stripe/webhook", {
        method: "POST",
        body: "{}",
        headers: { "stripe-signature": "bad_sig" },
      })
    );
    expect(res.status).toBe(400);
  });

  it("handles checkout.session.completed", async () => {
    mockConstructEvent.mockReturnValue({
      type: "checkout.session.completed",
      data: {
        object: {
          id: "cs_test",
          amount_total: 2090,
          customer_details: { email: "buyer@test.com" },
          metadata: {},
        },
      },
    });

    const res = await POST(
      new Request("http://localhost:3000/api/stripe/webhook", {
        method: "POST",
        body: "{}",
        headers: { "stripe-signature": "valid_sig" },
      })
    );
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.received).toBe(true);
    expect(sendEmail).toHaveBeenCalled();
  });

  it("returns received for other event types", async () => {
    mockConstructEvent.mockReturnValue({ type: "payment_intent.succeeded", data: { object: {} } });
    const res = await POST(
      new Request("http://localhost:3000/api/stripe/webhook", {
        method: "POST",
        body: "{}",
        headers: { "stripe-signature": "valid_sig" },
      })
    );
    expect(res.status).toBe(200);
  });
});
