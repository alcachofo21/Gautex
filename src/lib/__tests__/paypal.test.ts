import { describe, it, expect, beforeEach, vi } from "vitest";
import { createPayPalOrder, capturePayPalOrder } from "@/lib/payments/paypal";
import { priceCart } from "@/lib/payments/config";
import { makeCartItem } from "@/test-helpers/api";

describe("PayPal", () => {
  beforeEach(() => {
    vi.stubEnv("PAYPAL_CLIENT_ID", "test-client");
    vi.stubEnv("PAYPAL_CLIENT_SECRET", "test-secret");
    vi.stubEnv("PAYPAL_MODE", "sandbox");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "http://localhost:3000");
  });

  it("creates PayPal order", async () => {
    globalThis.fetch = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ access_token: "token123" }), { status: 200 })
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            id: "ORDER123",
            links: [{ rel: "approve", href: "https://paypal.com/approve" }],
          }),
          { status: 200 }
        )
      );

    const pricing = priceCart([makeCartItem()]);
    const result = await createPayPalOrder(pricing, "es");
    expect(result.orderId).toBe("ORDER123");
    expect(result.approvalUrl).toContain("paypal.com");
  });

  it("captures PayPal order", async () => {
    globalThis.fetch = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ access_token: "token123" }), { status: 200 })
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            status: "COMPLETED",
            payer: { email_address: "buyer@test.com" },
          }),
          { status: 200 }
        )
      );

    const result = await capturePayPalOrder("ORDER123");
    expect(result.status).toBe("COMPLETED");
    expect(result.payerEmail).toBe("buyer@test.com");
  });

  it("throws when not configured", async () => {
    vi.unstubAllEnvs();
    await expect(capturePayPalOrder("ORDER123")).rejects.toThrow();
  });

  it("throws when create order fails", async () => {
    globalThis.fetch = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ access_token: "token123" }), { status: 200 })
      )
      .mockResolvedValueOnce(new Response("error", { status: 500 }));

    const pricing = priceCart([makeCartItem()]);
    await expect(createPayPalOrder(pricing, "en")).rejects.toThrow(/PayPal/);
  });

  it("throws when approval URL is missing", async () => {
    globalThis.fetch = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ access_token: "token123" }), { status: 200 })
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ id: "ORDER123", links: [] }), { status: 200 })
      );

    const pricing = priceCart([makeCartItem()]);
    await expect(createPayPalOrder(pricing, "es")).rejects.toThrow(/approval URL/);
  });

  it("throws when capture fails", async () => {
    globalThis.fetch = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ access_token: "token123" }), { status: 200 })
      )
      .mockResolvedValueOnce(new Response("error", { status: 500 }));

    await expect(capturePayPalOrder("ORDER123")).rejects.toThrow(/capturar/);
  });

  it("uses live API URL in live mode", async () => {
    vi.stubEnv("PAYPAL_MODE", "live");
    globalThis.fetch = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ access_token: "token123" }), { status: 200 })
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            id: "ORDER123",
            links: [{ rel: "approve", href: "https://paypal.com/approve" }],
          }),
          { status: 200 }
        )
      );

    const pricing = priceCart([makeCartItem()]);
    await createPayPalOrder(pricing, "en");
    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining("api-m.paypal.com"),
      expect.anything()
    );
  });
});
