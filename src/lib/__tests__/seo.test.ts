import { describe, it, expect } from "vitest";
import { localePath, buildPageMetadata } from "@/lib/seo";

describe("seo", () => {
  it("builds locale paths", () => {
    expect(localePath("/productos", "en")).toBe("/en/productos");
    expect(localePath("/sectores", "en")).toBe("/en/sectors");
  });

  it("builds page metadata", () => {
    const meta = buildPageMetadata({
      title: "Test",
      description: "Desc",
      path: "/productos",
      locale: "es",
    });
    expect(meta.title).toBe("Test");
    expect(meta.description).toBe("Desc");
    expect(meta.alternates?.canonical).toContain("/productos");
  });

  it("supports noIndex", () => {
    const meta = buildPageMetadata({
      title: "Test",
      description: "Desc",
      path: "/admin",
      noIndex: true,
    });
    expect(meta.robots).toEqual({ index: false, follow: false });
  });
});
