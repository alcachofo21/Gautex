import "@testing-library/jest-dom/vitest";
import { beforeEach, afterEach, vi } from "vitest";

process.env.NEXT_PUBLIC_SITE_URL = "http://localhost:3000";
process.env.NODE_ENV = "test";

const originalFetch = globalThis.fetch;

beforeEach(() => {
  globalThis.fetch = vi.fn().mockResolvedValue(
    new Response(JSON.stringify({ ok: true }), { status: 200 })
  ) as typeof fetch;
});

afterEach(() => {
  globalThis.fetch = originalFetch;
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
});
