"use client";

import { ShoppingCart } from "lucide-react";
import type { Product } from "@/types";
import { useCart } from "@/lib/cart";
import { Button } from "@/components/ui/Button";
import { getUi, type Locale } from "@/lib/locale";

interface StickyAddToCartProps {
  product: Product;
  locale?: Locale;
}

export function StickyAddToCart({ product, locale = "es" }: StickyAddToCartProps) {
  const { addItem } = useCart();
  const ui = getUi(locale);

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-30 border-t border-line bg-white/95 p-4 shadow-2xl backdrop-blur lg:hidden"
      style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
    >
      <div className="flex items-center gap-4">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm text-text-muted">{product.name}</p>
          <p className="price text-lg">{product.priceLabel}</p>
        </div>
        <Button
          onClick={() =>
            addItem({
              productId: product.id,
              slug: product.slug,
              name: product.name,
              category: product.category,
              priceLabel: product.priceLabel,
              color: product.color,
              image: product.image,
            })
          }
        >
          <ShoppingCart className="h-5 w-5" />
          {ui.product.addToCart}
        </Button>
      </div>
    </div>
  );
}
