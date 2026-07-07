import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import { middleware } from "@/middleware";

describe("middleware", () => {
  it("sets security headers", () => {
    delete process.env.NEXT_PUBLIC_SITE_URL;
    const request = new NextRequest("http://localhost:3000/productos");
    const response = middleware(request);

    expect(response.headers.get("Content-Security-Policy")).toContain("default-src 'self'");
    expect(response.headers.get("X-Frame-Options")).toBe("DENY");
    expect(response.headers.get("X-Content-Type-Options")).toBe("nosniff");
    expect(response.headers.get("Referrer-Policy")).toBe("strict-origin-when-cross-origin");
    expect(response.headers.get("Permissions-Policy")).toContain("camera=()");
  });

  it("redirects apex host to www when configured", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://www.gautex.com";
    const request = new NextRequest("https://gautex.com/productos", {
      headers: { host: "gautex.com" },
    });
    const response = middleware(request);
    expect(response.status).toBe(301);
    expect(response.headers.get("location")).toContain("www.gautex.com");
  });

  it("ignores invalid site URL during redirect check", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "not-valid";
    const request = new NextRequest("https://gautex.com/", {
      headers: { host: "gautex.com" },
    });
    const response = middleware(request);
    expect(response.status).toBe(200);
  });

  it("sets HSTS in production", () => {
    const prev = process.env.NODE_ENV;
    process.env.NODE_ENV = "production";
    delete process.env.NEXT_PUBLIC_SITE_URL;
    const response = middleware(new NextRequest("https://www.gautex.com/"));
    expect(response.headers.get("Strict-Transport-Security")).toContain("max-age=");
    process.env.NODE_ENV = prev;
  });
});
