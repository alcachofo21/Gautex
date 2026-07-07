/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useCart } from "@/lib/cart";

describe("useCart", () => {
  beforeEach(() => {
    useCart.setState({ items: [], isOpen: false });
  });

  it("adds and removes items", () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addItem({
        productId: "matrix-condoms",
        slug: "matrix-condoms",
        name: "Matrix",
        category: "preventivo",
        priceLabel: "20,90 €",
        color: "#000",
      });
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.totalItems()).toBe(1);

    act(() => {
      result.current.removeItem("matrix-condoms");
    });

    expect(result.current.items).toHaveLength(0);
  });

  it("updates quantity and clears cart", () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addItem({
        productId: "matrix-condoms",
        slug: "matrix-condoms",
        name: "Matrix",
        category: "preventivo",
        priceLabel: "20,90 €",
        color: "#000",
      }, 2);
    });

    act(() => {
      result.current.updateQuantity("matrix-condoms", 3);
    });
    expect(result.current.items[0].quantity).toBe(3);

    act(() => {
      result.current.clearCart();
    });
    expect(result.current.items).toHaveLength(0);
  });

  it("toggles cart drawer", () => {
    const { result } = renderHook(() => useCart());
    act(() => result.current.openCart());
    expect(result.current.isOpen).toBe(true);
    act(() => result.current.toggleCart());
    expect(result.current.isOpen).toBe(false);
  });
});
