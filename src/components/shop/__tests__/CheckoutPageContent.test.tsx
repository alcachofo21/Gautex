/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { CheckoutPageContent } from "@/components/shop/CheckoutPageContent";
import { useCart } from "@/lib/cart";

vi.mock("@/lib/analytics", () => ({
  trackEvent: vi.fn(),
}));

vi.mock("@/components/shop/InstantPaymentPanel", () => ({
  InstantPaymentPanel: () => <div data-testid="payment-panel">Payment</div>,
}));

describe("CheckoutPageContent", () => {
  beforeEach(() => {
    useCart.setState({ items: [], isOpen: false });
    globalThis.fetch = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          methods: [],
          instantCheckoutEnabled: false,
          pricing: { payable: false, totalCents: 0 },
        }),
        { status: 200 }
      )
    );
  });

  it("shows empty cart message", () => {
    render(<CheckoutPageContent locale="es" />);
    expect(screen.getByText(/No hay productos en el carrito/i)).toBeInTheDocument();
  });

  it("loads checkout info when cart has items", async () => {
    useCart.setState({
      items: [
        {
          productId: "matrix-condoms",
          slug: "matrix-condoms",
          name: "Matrix",
          category: "preventivo",
          quantity: 1,
          priceLabel: "20,90 €",
          color: "#000",
        },
      ],
      isOpen: false,
    });

    render(<CheckoutPageContent locale="es" />);
    await vi.waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalled();
    });
  });
});
