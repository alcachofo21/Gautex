import { describe, it, expect, beforeEach } from "vitest";
import { assertSameOrigin, readJsonBodyWithLimit } from "@/lib/api-guard";
import { createApiRequest } from "@/test-helpers/api";

describe("assertSameOrigin", () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_SITE_URL = "http://localhost:3000";
    process.env.NODE_ENV = "test";
  });

  it("allows localhost origin", () => {
    const req = createApiRequest("/api/contact", { method: "POST" });
    expect(assertSameOrigin(req)).toBeNull();
  });

  it("rejects unknown origin", () => {
    const req = new Request("http://localhost:3000/api/contact", {
      method: "POST",
      headers: { origin: "https://evil.com" },
    });
    const result = assertSameOrigin(req);
    expect(result?.status).toBe(403);
  });

  it("rejects missing origin", () => {
    const req = new Request("http://localhost:3000/api/contact", { method: "POST" });
    const result = assertSameOrigin(req);
    expect(result?.status).toBe(403);
  });

  it("allows configured production origin", () => {
    process.env.NODE_ENV = "production";
    process.env.NEXT_PUBLIC_SITE_URL = "https://www.gautex.com";
    const req = new Request("https://www.gautex.com/api/contact", {
      method: "POST",
      headers: { origin: "https://www.gautex.com" },
    });
    expect(assertSameOrigin(req)).toBeNull();
  });

  it("allows apex origin when canonical is www", () => {
    process.env.NODE_ENV = "production";
    process.env.NEXT_PUBLIC_SITE_URL = "https://www.gautex.com";
    const req = new Request("https://gautex.com/api/contact", {
      method: "POST",
      headers: { origin: "https://gautex.com" },
    });
    expect(assertSameOrigin(req)).toBeNull();
  });

  it("allows origin from referer header", () => {
    const req = new Request("http://localhost:3000/api/contact", {
      method: "POST",
      headers: { referer: "http://localhost:3000/contacto" },
    });
    expect(assertSameOrigin(req)).toBeNull();
  });

  it("rejects invalid referer URL", () => {
    const req = new Request("http://localhost:3000/api/contact", {
      method: "POST",
      headers: { referer: "not-a-valid-url" },
    });
    expect(assertSameOrigin(req)?.status).toBe(403);
  });

  it("ignores invalid site URL in env", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "not-a-url";
    process.env.NODE_ENV = "test";
    const req = createApiRequest("/api/contact", { method: "POST" });
    expect(assertSameOrigin(req)).toBeNull();
  });
});

describe("readJsonBodyWithLimit", () => {
  it("parses valid JSON", async () => {
    const req = createApiRequest("/api/contact", {
      method: "POST",
      body: JSON.stringify({ foo: "bar" }),
    });
    const result = await readJsonBodyWithLimit(req);
    expect("body" in result && result.body).toEqual({ foo: "bar" });
  });

  it("rejects oversized body", async () => {
    const req = createApiRequest("/api/contact", {
      method: "POST",
      body: "x".repeat(101 * 1024),
    });
    const result = await readJsonBodyWithLimit(req);
    expect("error" in result && result.error.status).toBe(413);
  });

  it("rejects invalid JSON", async () => {
    const req = createApiRequest("/api/contact", {
      method: "POST",
      body: "{invalid",
    });
    const result = await readJsonBodyWithLimit(req);
    expect("error" in result && result.error.status).toBe(400);
  });

  it("rejects oversized content-length header", async () => {
    const req = createApiRequest("/api/contact", {
      method: "POST",
      headers: { "content-length": "200000" },
      body: "{}",
    });
    const result = await readJsonBodyWithLimit(req);
    expect("error" in result && result.error.status).toBe(413);
  });

  it("parses empty body as empty object", async () => {
    const req = createApiRequest("/api/contact", { method: "POST", body: "" });
    const result = await readJsonBodyWithLimit(req);
    expect("body" in result && result.body).toEqual({});
  });
});
