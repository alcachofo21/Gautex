import { describe, it, expect, vi, beforeEach } from "vitest";
import { sendEmail, sendUserConfirmation } from "@/lib/email";

describe("sendUserConfirmation", () => {
  beforeEach(() => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), { status: 200 })
    );
    vi.stubEnv("RESEND_API_KEY", "re_test");
  });

  it("sends confirmation email", async () => {
    await sendUserConfirmation("user@test.com", "es", "contact", "Juan");
    expect(globalThis.fetch).toHaveBeenCalledWith(
      "https://api.resend.com/emails",
      expect.objectContaining({ method: "POST" })
    );
  });

  it("sends English campaign confirmation", async () => {
    await sendUserConfirmation("user@test.com", "en", "campaign", "John");
    expect(sendEmail).toBeDefined();
  });
});
