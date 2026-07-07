import { describe, it, expect, beforeEach } from "vitest";
import { getSiteUrl, absoluteUrl } from "@/lib/site";

describe("site", () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_SITE_URL = "http://localhost:3000";
  });

  it("returns site URL", () => {
    expect(getSiteUrl()).toBe("http://localhost:3000");
  });

  it("builds absolute URL", () => {
    expect(absoluteUrl("/contacto")).toBe("http://localhost:3000/contacto");
    expect(absoluteUrl("contacto")).toBe("http://localhost:3000/contacto");
  });
});
