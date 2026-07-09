"use client";

import { useEffect } from "react";
import { useCart } from "@/lib/cart";

/** Rehydrates cart from localStorage on the client (required with skipHydration in Next.js). */
export function CartHydration() {
  useEffect(() => {
    let cancelled = false;

    const markHydrated = () => {
      if (!cancelled) useCart.setState({ hasHydrated: true });
    };

    void useCart.persist.rehydrate().then(markHydrated).catch(markHydrated);

    const timeout = window.setTimeout(markHydrated, 500);

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
    };
  }, []);

  return null;
}
