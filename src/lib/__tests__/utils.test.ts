import { describe, it, expect } from "vitest";
import { cn, formatPhone } from "@/lib/utils";

describe("utils", () => {
  it("joins class names", () => {
    expect(cn("a", false, "b", null, "c")).toBe("a b c");
  });

  it("formats phone removing spaces", () => {
    expect(formatPhone("600 123 456")).toBe("600123456");
  });
});
