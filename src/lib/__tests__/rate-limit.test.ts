import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { rateLimit, clientIp, resetRateLimitBuckets, RATE_LIMIT_DEFAULT } from "@/lib/rate-limit";

describe("rateLimit", () => {
  beforeEach(() => {
    resetRateLimitBuckets();
  });

  it("allows requests under the limit", () => {
    expect(rateLimit("test-key", 3).ok).toBe(true);
    expect(rateLimit("test-key", 3).ok).toBe(true);
    expect(rateLimit("test-key", 3).ok).toBe(true);
  });

  it("blocks requests over the limit", () => {
    for (let i = 0; i < RATE_LIMIT_DEFAULT; i++) {
      rateLimit("blocked-key", 3);
    }
    const result = rateLimit("blocked-key", 3);
    expect(result.ok).toBe(false);
    expect(result.retryAfter).toBeGreaterThan(0);
  });

  it("resets after window expires", () => {
    vi.useFakeTimers();
    rateLimit("expired-key", 1, 1000);
    expect(rateLimit("expired-key", 1, 1000).ok).toBe(false);
    vi.advanceTimersByTime(1001);
    expect(rateLimit("expired-key", 1, 1000).ok).toBe(true);
    vi.useRealTimers();
  });

  it("cleans up expired buckets periodically", () => {
    vi.useFakeTimers();
    const now = Date.now();
    vi.setSystemTime(now);
    rateLimit("old-key", 1, 500);
    vi.setSystemTime(now + 61_000);
    rateLimit("new-key", 10, 60_000);
    expect(rateLimit("old-key", 1, 500).ok).toBe(true);
    vi.useRealTimers();
  });
});

describe("clientIp", () => {
  it("reads x-forwarded-for", () => {
    const req = new Request("http://localhost", {
      headers: { "x-forwarded-for": "1.2.3.4, 5.6.7.8" },
    });
    expect(clientIp(req)).toBe("1.2.3.4");
  });

  it("falls back to x-real-ip", () => {
    const req = new Request("http://localhost", {
      headers: { "x-real-ip": "9.9.9.9" },
    });
    expect(clientIp(req)).toBe("9.9.9.9");
  });

  it("returns unknown when no headers", () => {
    expect(clientIp(new Request("http://localhost"))).toBe("unknown");
  });
});
