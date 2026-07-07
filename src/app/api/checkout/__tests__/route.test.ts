import { describe, it, expect, beforeEach, vi } from "vitest";
import { POST, GET } from "@/app/api/checkout/route";
import { createApiRequest, makeCartItem } from "@/test-helpers/api";
import { resetRateLimitBuckets } from "@/lib/rate-limit";

vi.mock("@/lib/payments/paypal", () => ({
  createPayPalOrder: vi.fn().mockResolvedValue({ approvalUrl: "https://paypal.com/approve" }),
}));

vi.mock("@/lib/payments/stripe-checkout", () => ({
  createStripeCheckoutSession: vi.fn().mockResolvedValue({ url: "https://checkout.stripe.com/test" }),
}));

describe("POST /api/checkout", () => {
  beforeEach(() => {
    resetRateLimitBuckets();
    vi.unstubAllEnvs();
  });

  it("creates PayPal checkout", async () => {
    vi.stubEnv("PAYPAL_CLIENT_ID", "id");
    vi.stubEnv("PAYPAL_CLIENT_SECRET", "secret");

    const res = await POST(
      createApiRequest("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: [makeCartItem()], provider: "paypal" }),
      })
    );
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.url).toContain("paypal.com");
  });

  it("creates Stripe checkout", async () => {
    vi.stubEnv("STRIPE_SECRET_KEY", "sk_test");
    vi.stubEnv("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY", "pk_test");

    const res = await POST(
      createApiRequest("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: [makeCartItem()],
          provider: "stripe",
          customerEmail: "buyer@test.com",
        }),
      })
    );
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.url).toContain("stripe.com");
  });

  it("returns 400 for invalid cart", async () => {
    const res = await POST(
      createApiRequest("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: [], provider: "paypal" }),
      })
    );
    expect(res.status).toBe(400);
  });

  it("returns 400 for unknown provider", async () => {
    const res = await POST(
      createApiRequest("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: [makeCartItem()], provider: "bitcoin" }),
      })
    );
    expect(res.status).toBe(400);
  });

  it("returns 503 when PayPal not configured", async () => {
    delete process.env.PAYPAL_CLIENT_ID;
    delete process.env.PAYPAL_CLIENT_SECRET;

    const res = await POST(
      createApiRequest("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: [makeCartItem()], provider: "paypal" }),
      })
    );
    expect(res.status).toBe(503);
  });

  it("returns 503 when Stripe not configured", async () => {
    delete process.env.STRIPE_SECRET_KEY;
    delete process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

    const res = await POST(
      createApiRequest("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: [makeCartItem()], provider: "stripe" }),
      })
    );
    expect(res.status).toBe(503);
  });

  it("returns 400 when cart is not payable", async () => {
    vi.stubEnv("PAYPAL_CLIENT_ID", "id");
    vi.stubEnv("PAYPAL_CLIENT_SECRET", "secret");

    const res = await POST(
      createApiRequest("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: [{ ...makeCartItem(), productId: "preservativo-femenino", name: "PF" }],
          provider: "paypal",
        }),
      })
    );
    expect(res.status).toBe(400);
  });

  it("returns 429 when rate limited", async () => {
    vi.stubEnv("PAYPAL_CLIENT_ID", "id");
    vi.stubEnv("PAYPAL_CLIENT_SECRET", "secret");

    for (let i = 0; i < 6; i++) {
      await POST(
        createApiRequest("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-forwarded-for": "5.5.5.5" },
          body: JSON.stringify({ items: [makeCartItem()], provider: "paypal" }),
        })
      );
    }
    const res = await POST(
      createApiRequest("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-forwarded-for": "5.5.5.5" },
        body: JSON.stringify({ items: [makeCartItem()], provider: "paypal" }),
      })
    );
    expect(res.status).toBe(429);
  });
});

describe("GET /api/checkout", () => {
  it("returns checkout info", async () => {
    const items = encodeURIComponent(JSON.stringify([makeCartItem()]));
    const res = await GET(new Request(`http://localhost:3000/api/checkout?locale=es&items=${items}`));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toHaveProperty("methods");
    expect(data).toHaveProperty("pricing");
  });

  it("ignores invalid items JSON in query", async () => {
    const res = await GET(
      new Request("http://localhost:3000/api/checkout?locale=en&items=not-json")
    );
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.pricing.payable).toBe(false);
  });

  it("returns English locale methods", async () => {
    const res = await GET(new Request("http://localhost:3000/api/checkout?locale=en"));
    expect(res.status).toBe(200);
  });
});
