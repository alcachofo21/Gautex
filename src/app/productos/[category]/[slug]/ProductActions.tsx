"use client";

import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import type { Product } from "@/types";
import { useCart } from "@/lib/cart";
import { Button } from "@/components/ui/Button";
import { getUi, localizedPath, type Locale } from "@/lib/locale";
import { trackEvent } from "@/lib/analytics";

interface ProductActionsProps {
  product: Product;
  locale?: Locale;
}

export function ProductActions({ product, locale = "es" }: ProductActionsProps) {
  const ui = getUi(locale);
  const p = ui.product;
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
      <div className="flex items-center gap-3">
        <label className="text-sm font-medium">{ui.cart.quantity}</label>
        <input
          type="number"
          min={1}
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
          className="w-20 min-h-[48px] rounded-xl border border-gray-300 px-3 text-center"
        />
      </div>
      <Button
        onClick={() => {
          addItem(
            {
              productId: product.id,
              slug: product.slug,
              name: product.name,
              category: product.category,
              priceLabel: product.priceLabel,
              color: product.color,
              image: product.image,
            },
            quantity
          );
          trackEvent("add_to_cart", { product: product.id, quantity });
        }}
        className="sm:flex-1"
      >
        <ShoppingCart className="h-5 w-5" />
        {p.addToCartFull}
      </Button>
      <Button href={localizedPath("/contacto", locale)} variant="outline">
        {p.requestQuote}
      </Button>
    </div>
  );
}
