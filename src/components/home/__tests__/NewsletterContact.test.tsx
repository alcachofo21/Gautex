/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NewsletterContact } from "@/components/home/NewsletterContact";

vi.mock("@/lib/analytics", () => ({
  trackEvent: vi.fn(),
}));

describe("NewsletterContact", () => {
  beforeEach(() => {
    globalThis.fetch = vi.fn().mockResolvedValue(new Response(JSON.stringify({ success: true }), { status: 200 }));
  });

  it("renders newsletter form", () => {
    render(<NewsletterContact locale="es" />);
    expect(screen.getByRole("button", { name: /suscribir/i })).toBeInTheDocument();
  });

  it("subscribes successfully", async () => {
    const user = userEvent.setup();
    render(<NewsletterContact locale="es" />);

    const input = screen.getByPlaceholderText(/email/i);
    await user.type(input, "subscriber@test.com");
    await user.click(screen.getByRole("button", { name: /suscribir/i }));

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledWith(
        "/api/contact",
        expect.objectContaining({ method: "POST" })
      );
    });
  });
});
