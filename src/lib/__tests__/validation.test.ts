import { describe, it, expect } from "vitest";
import { contactSchema, quoteSchema, checkoutSchema } from "@/lib/validation";
import { makeCartItem } from "@/test-helpers/api";

describe("contactSchema", () => {
  it("accepts valid contact", () => {
    const result = contactSchema.safeParse({
      firstName: "Ana",
      lastName: "Ruiz",
      email: "ana@test.com",
      message: "Hola",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid email", () => {
    const result = contactSchema.safeParse({
      firstName: "Ana",
      lastName: "Ruiz",
      email: "not-email",
      message: "Hola",
    });
    expect(result.success).toBe(false);
  });

  it("rejects honeypot with silent handling at API layer", () => {
    const result = contactSchema.safeParse({
      firstName: "Ana",
      lastName: "Ruiz",
      email: "ana@test.com",
      message: "Hola",
      website: "spam-bot",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.website).toBe("spam-bot");
    }
  });
});

describe("quoteSchema", () => {
  it("accepts valid quote", () => {
    const result = quoteSchema.safeParse({
      type: "cart",
      firstName: "Ana",
      email: "ana@test.com",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid type", () => {
    const result = quoteSchema.safeParse({
      type: "invalid",
      firstName: "Ana",
      email: "ana@test.com",
    });
    expect(result.success).toBe(false);
  });
});

describe("checkoutSchema", () => {
  it("accepts valid checkout", () => {
    const result = checkoutSchema.safeParse({
      items: [makeCartItem()],
      provider: "stripe",
      customerEmail: "buyer@test.com",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty cart", () => {
    const result = checkoutSchema.safeParse({ items: [] });
    expect(result.success).toBe(false);
  });

  it("rejects invalid provider", () => {
    const result = checkoutSchema.safeParse({
      items: [makeCartItem()],
      provider: "bitcoin",
    });
    expect(result.success).toBe(false);
  });
});
