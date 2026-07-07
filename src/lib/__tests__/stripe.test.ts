import { describe, it, expect, beforeEach, vi } from "vitest";
import { getStripe, isStripeEnabled } from "@/lib/stripe";

describe("stripe", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns null without secret key", () => {
    delete process.env.STRIPE_SECRET_KEY;
    expect(getStripe()).toBeNull();
  });

  it("returns stripe instance with key", () => {
    vi.stubEnv("STRIPE_SECRET_KEY", "sk_test_123");
    expect(getStripe()).not.toBeNull();
  });

  it("checks if stripe is enabled", () => {
    vi.stubEnv("STRIPE_SECRET_KEY", "sk_test_123");
    vi.stubEnv("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY", "pk_test_123");
    expect(isStripeEnabled()).toBe(true);
  });
});
