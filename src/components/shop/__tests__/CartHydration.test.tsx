/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, waitFor } from "@testing-library/react";
import { CartHydration } from "@/components/shop/CartHydration";
import { useCart } from "@/lib/cart";

describe("CartHydration", () => {
  beforeEach(() => {
    useCart.setState({ items: [], isOpen: false, hasHydrated: false });
    vi.spyOn(useCart.persist, "rehydrate").mockResolvedValue(undefined);
  });

  it("marks cart as hydrated after rehydrate", async () => {
    render(<CartHydration />);

    await waitFor(() => {
      expect(useCart.getState().hasHydrated).toBe(true);
    });
    expect(useCart.persist.rehydrate).toHaveBeenCalled();
  });
});
