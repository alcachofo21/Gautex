"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useEffect, useState } from "react";
import type { CartItem } from "@/types";
import { products } from "@/lib/products";
import { maxOrderQuantity } from "@/lib/inventory";

function clampQuantity(productId: string, quantity: number): number {
  const product = products.find((p) => p.id === productId);
  if (!product) return Math.max(1, quantity);
  const max = maxOrderQuantity(product);
  if (max === null) return Math.max(1, quantity);
  return Math.max(1, Math.min(quantity, max));
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  totalItems: () => number;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      addItem: (item, quantity = 1) => {
        set((state) => {
          const qty = clampQuantity(item.productId, quantity);
          const existing = state.items.find((i) => i.productId === item.productId);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === item.productId
                  ? { ...i, quantity: clampQuantity(item.productId, i.quantity + qty) }
                  : i
              ),
              isOpen: true,
            };
          }
          return { items: [...state.items, { ...item, quantity: qty }], isOpen: true };
        });
      },
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        })),
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId ? { ...i, quantity: clampQuantity(productId, quantity) } : i
          ),
        }));
      },
      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: "gautex-cart" }
  )
);

export function useCartHydrated(): boolean {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!useCart.persist.hasHydrated()) {
      void useCart.persist.rehydrate();
    }
  }, []);

  return mounted;
}
