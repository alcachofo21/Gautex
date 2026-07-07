import { describe, it, expect, beforeEach, vi } from "vitest";
import { createStripeCheckoutSession } from "@/lib/payments/stripe-checkout";
import { priceCart } from "@/lib/payments/config";
import { makeCartItem } from "@/test-helpers/api";
import { getStripe } from "@/lib/stripe";

const mockCreate = vi.fn().mockResolvedValue({ url: "https://checkout.stripe.com/test" });

vi.mock("@/lib/stripe", () => ({
  getStripe: vi.fn(() => ({
    checkout: {
      sessions: { create: mockCreate },
    },
  })),
}));

describe("createStripeCheckoutSession", () => {
  beforeEach(() => {
    mockCreate.mockClear();
    vi.mocked(getStripe).mockReturnValue({
      checkout: { sessions: { create: mockCreate } },
    } as never);
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "http://localhost:3000");
  });

  it("creates a checkout session", async () => {
    const pricing = priceCart([makeCartItem()]);
    const session = await createStripeCheckoutSession({
      pricing,
      locale: "es",
      customerEmail: "buyer@test.com",
    });
    expect(session.url).toContain("stripe.com");
    expect(mockCreate).toHaveBeenCalledOnce();
  });

  it("creates English session without customer email", async () => {
    const pricing = priceCart([makeCartItem()]);
    await createStripeCheckoutSession({ pricing, locale: "en" });
    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({ locale: "en" })
    );
  });

  it("throws when stripe is not configured", async () => {
    vi.mocked(getStripe).mockReturnValueOnce(null);
    const pricing = priceCart([makeCartItem()]);
    await expect(createStripeCheckoutSession({ pricing, locale: "es" })).rejects.toThrow(
      /Stripe/
    );
  });
});
