import { describe, it, expect } from "vitest";
import { legacyRedirects } from "@/lib/redirects";

describe("legacyRedirects", () => {
  it("has redirects defined", () => {
    expect(legacyRedirects.length).toBeGreaterThan(0);
  });

  it("all redirects have required fields", () => {
    for (const redirect of legacyRedirects) {
      expect(redirect.source).toBeTruthy();
      expect(redirect.destination).toBeTruthy();
      expect(redirect.permanent).toBe(true);
    }
  });

  it("includes legacy product redirects", () => {
    const matrix = legacyRedirects.find((r) => r.destination === "/productos/preventivo/matrix-condoms");
    expect(matrix).toBeDefined();
  });
});
