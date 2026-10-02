import { describe, it, expect, beforeEach } from "vitest";
import { getSiteUrl, absoluteUrl } from "@/lib/site";

describe("site", () => {
  beforeEach(() => {
    delete process.env.SITE_URL;
    process.env.NEXT_PUBLIC_SITE_URL = "http://localhost:3000";
  });

  it("returns site URL", () => {
    expect(getSiteUrl()).toBe("http://localhost:3000");
  });

  it("prefers SITE_URL over NEXT_PUBLIC_SITE_URL", () => {
    process.env.SITE_URL = "https://gautex-web.onrender.com";
    process.env.NEXT_PUBLIC_SITE_URL = "https://www.gautex.com";
    expect(getSiteUrl()).toBe("https://gautex-web.onrender.com");
  });

  it("builds absolute URL", () => {
    expect(absoluteUrl("/contacto")).toBe("http://localhost:3000/contacto");
    expect(absoluteUrl("contacto")).toBe("http://localhost:3000/contacto");
  });
});
