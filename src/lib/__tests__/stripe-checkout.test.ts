import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  createStripeCheckoutSession,
  fulfillStripeCheckoutSession,
} from "@/lib/payments/stripe-checkout";
import { priceCart } from "@/lib/payments/config";
import { makeCartItem } from "@/test-helpers/api";
import { getStripe } from "@/lib/stripe";

const mockCreate = vi.fn().mockResolvedValue({ url: "https://checkout.stripe.com/test" });
const mockRetrieve = vi.fn();
const mockUpdate = vi.fn().mockResolvedValue({});

vi.mock("@/lib/stripe", () => ({
  getStripe: vi.fn(() => ({
    checkout: {
      sessions: { create: mockCreate, retrieve: mockRetrieve, update: mockUpdate },
    },
  })),
}));

vi.mock("@/lib/email", () => ({
  sendPurchaseEmails: vi.fn().mockResolvedValue({ ok: true }),
}));

import { sendPurchaseEmails } from "@/lib/email";

describe("createStripeCheckoutSession", () => {
  beforeEach(() => {
    mockCreate.mockClear();
    mockRetrieve.mockReset();
    mockUpdate.mockClear();
    vi.mocked(sendPurchaseEmails).mockResolvedValue({ ok: true });
    vi.mocked(getStripe).mockReturnValue({
      checkout: { sessions: { create: mockCreate, retrieve: mockRetrieve, update: mockUpdate } },
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

describe("fulfillStripeCheckoutSession", () => {
  beforeEach(() => {
    mockRetrieve.mockReset();
    mockUpdate.mockClear();
    vi.mocked(sendPurchaseEmails).mockClear();
    vi.mocked(sendPurchaseEmails).mockResolvedValue({ ok: true });
    vi.mocked(getStripe).mockReturnValue({
      checkout: { sessions: { create: mockCreate, retrieve: mockRetrieve, update: mockUpdate } },
    } as never);
  });

  it("sends purchase emails for paid sessions", async () => {
    mockRetrieve.mockResolvedValue({
      id: "cs_test",
      payment_status: "paid",
      amount_total: 2090,
      customer_details: { email: "buyer@test.com", name: "Ana López" },
      metadata: { locale: "es", itemSummary: "Producto × 1", totalCents: "2090" },
    });

    const result = await fulfillStripeCheckoutSession("cs_test");

    expect(result.ok).toBe(true);
    expect(sendPurchaseEmails).toHaveBeenCalled();
    expect(mockUpdate).toHaveBeenCalled();
  });

  it("skips duplicate emails", async () => {
    mockRetrieve.mockResolvedValue({
      id: "cs_test",
      payment_status: "paid",
      metadata: { purchaseEmailSent: "true" },
    });

    const result = await fulfillStripeCheckoutSession("cs_test");

    expect(result.alreadySent).toBe(true);
    expect(sendPurchaseEmails).not.toHaveBeenCalled();
  });

  it("returns error when payment is not completed", async () => {
    mockRetrieve.mockResolvedValue({
      id: "cs_test",
      payment_status: "unpaid",
      metadata: {},
    });

    const result = await fulfillStripeCheckoutSession("cs_test");

    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/Pago no completado/);
  });

  it("returns error when stripe is not configured", async () => {
    vi.mocked(getStripe).mockReturnValueOnce(null);
    const result = await fulfillStripeCheckoutSession("cs_test");
    expect(result.ok).toBe(false);
  });

  it("returns error when purchase emails fail", async () => {
    mockRetrieve.mockResolvedValue({
      id: "cs_test",
      payment_status: "paid",
      amount_total: 2090,
      customer_details: { email: "buyer@test.com" },
      metadata: { locale: "es", totalCents: "2090" },
    });
    vi.mocked(sendPurchaseEmails).mockResolvedValueOnce({ ok: false, error: "SMTP down" });

    const result = await fulfillStripeCheckoutSession("cs_test");

    expect(result.ok).toBe(false);
    expect(result.error).toBe("SMTP down");
  });
});
