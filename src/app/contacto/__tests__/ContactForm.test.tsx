/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ContactForm } from "@/app/contacto/ContactForm";

vi.mock("@/lib/analytics", () => ({
  trackEvent: vi.fn(),
}));

describe("ContactForm", () => {
  beforeEach(() => {
    globalThis.fetch = vi.fn().mockResolvedValue(new Response(JSON.stringify({ success: true }), { status: 200 }));
  });

  it("renders form fields", () => {
    render(<ContactForm locale="es" />);
    expect(screen.getByRole("button", { name: /enviar/i })).toBeInTheDocument();
  });

  it("submits successfully", async () => {
    const user = userEvent.setup();
    render(<ContactForm locale="es" />);

    const textboxes = screen.getAllByRole("textbox");
    await user.type(textboxes[0], "Juan");
    await user.type(textboxes[1], "García");
    await user.type(textboxes[2], "juan@test.com");
    await user.type(textboxes[4], "Hola mundo");
    await user.click(screen.getByRole("button", { name: /enviar/i }));

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledWith(
        "/api/contact",
        expect.objectContaining({ method: "POST" })
      );
    });
  });
});
