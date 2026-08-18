import { describe, it, expect } from "vitest";
import { clampQuantity } from "@/lib/cart-utils";

describe("clampQuantity", () => {
  it("returns at least 1", () => {
    expect(clampQuantity("matrix-condoms", 0)).toBe(1);
    expect(clampQuantity("matrix-condoms", -5)).toBe(1);
  });

  it("does not clamp to warehouse stock", () => {
    expect(clampQuantity("matrix-condoms", 999999)).toBe(999999);
  });

  it("handles unknown product", () => {
    expect(clampQuantity("unknown-id", 5)).toBe(5);
  });
});
