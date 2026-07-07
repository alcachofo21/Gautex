import { describe, it, expect, beforeEach, vi } from "vitest";
import { notifyCrm } from "@/lib/crm";

describe("notifyCrm", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    globalThis.fetch = vi.fn().mockResolvedValue(new Response("ok", { status: 200 }));
  });

  it("no-ops without CRM_WEBHOOK_URL", async () => {
    delete process.env.CRM_WEBHOOK_URL;
    await notifyCrm("contact", { email: "a@b.com" });
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  it("posts to webhook when configured", async () => {
    vi.stubEnv("CRM_WEBHOOK_URL", "https://hooks.example.com/crm");
    await notifyCrm("quote", { email: "a@b.com" });
    expect(globalThis.fetch).toHaveBeenCalledWith(
      "https://hooks.example.com/crm",
      expect.objectContaining({ method: "POST" })
    );
  });

  it("handles fetch errors gracefully", async () => {
    vi.stubEnv("CRM_WEBHOOK_URL", "https://hooks.example.com/crm");
    globalThis.fetch = vi.fn().mockRejectedValue(new Error("network"));
    await expect(notifyCrm("contact", {})).resolves.toBeUndefined();
  });
});
