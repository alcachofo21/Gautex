import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  priceCart,
  formatEur,
  getEnabledPaymentMethods,
  hasInstantCheckout,
  isPayPalConfigured,
  isStripeConfigured,
  getStripePaymentMethodTypes,
} from "@/lib/payments/config";
import { makeCartItem } from "@/test-helpers/api";

describe("payments config", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
  });
  it("prices a valid cart from server catalog", () => {
    const pricing = priceCart([makeCartItem()]);
    expect(pricing.payable).toBe(true);
    expect(pricing.totalCents).toBeGreaterThan(0);
    expect(pricing.lines).toHaveLength(1);
  });

  it("rejects empty cart", () => {
    const pricing = priceCart([]);
    expect(pricing.payable).toBe(false);
  });

  it("rejects unknown product", () => {
    const pricing = priceCart([
      { ...makeCartItem(), productId: "nonexistent-product-xyz" },
    ]);
    expect(pricing.payable).toBe(false);
    expect(pricing.unpublishable.length).toBeGreaterThan(0);
  });

  it("allows large quantities without warehouse stock caps", () => {
    const pricing = priceCart([{ ...makeCartItem(), quantity: 999999 }]);
    expect(pricing.payable).toBe(true);
    expect(pricing.lines[0]?.quantity).toBe(999999);
  });

  it("formats EUR", () => {
    expect(formatEur(2090, "es")).toContain("20");
    expect(formatEur(2090, "en")).toContain("20");
  });

  it("detects payment provider configuration", () => {
    const hadStripe = isStripeConfigured();
    const hadPaypal = isPayPalConfigured();
    expect(typeof hadStripe).toBe("boolean");
    expect(typeof hadPaypal).toBe("boolean");
    expect(typeof hasInstantCheckout()).toBe("boolean");
    expect(getEnabledPaymentMethods("es")).toBeInstanceOf(Array);
  });

  it("returns only Stripe when PayPal is not configured", () => {
    vi.stubEnv("STRIPE_SECRET_KEY", "sk_test");
    vi.stubEnv("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY", "pk_test");
    delete process.env.PAYPAL_CLIENT_ID;
    delete process.env.PAYPAL_CLIENT_SECRET;

    const methods = getEnabledPaymentMethods("en");
    expect(methods).toHaveLength(1);
    expect(methods[0].id).toBe("stripe");
    expect(methods[0].label).toContain("card");
  });

  it("returns only PayPal when Stripe is not configured", () => {
    delete process.env.STRIPE_SECRET_KEY;
    delete process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    vi.stubEnv("PAYPAL_CLIENT_ID", "id");
    vi.stubEnv("PAYPAL_CLIENT_SECRET", "secret");

    const methods = getEnabledPaymentMethods("es");
    expect(methods).toHaveLength(1);
    expect(methods[0].id).toBe("paypal");
  });

  it("flags quote-only products in cart", () => {
    const pricing = priceCart([
      { ...makeCartItem(), productId: "preservativo-femenino", name: "PF" },
    ]);
    expect(pricing.payable).toBe(false);
  });

  it("rejects hidden catalogue products", () => {
    const pricing = priceCart([
      { ...makeCartItem(), productId: "viva-condoms-xl", name: "XL" },
    ]);
    expect(pricing.payable).toBe(false);
  });

  it("exposes stripe payment method types", () => {
    expect(getStripePaymentMethodTypes()).toEqual(["card"]);
  });
});
