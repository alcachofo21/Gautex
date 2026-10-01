"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart";

/** Ensures cart localStorage is read before showing cart/checkout UI. */
export function useCartReady() {
  const hasHydrated = useCart((state) => state.hasHydrated);
  const [ready, setReady] = useState(hasHydrated);

  useEffect(() => {
    if (hasHydrated) {
      setReady(true);
      return;
    }

    let cancelled = false;
    const markReady = () => {
      if (!cancelled) setReady(true);
    };

    const result = useCart.persist.rehydrate();
    void Promise.resolve(result).then(markReady).catch(markReady);
    const timeout = window.setTimeout(markReady, 300);

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
    };
  }, [hasHydrated]);

  return ready;
}
