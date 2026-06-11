"use client";

import { ShoppingCart } from "lucide-react";
import type { Product } from "@/types";
import { useCart } from "@/lib/cart";
import { Button } from "@/components/ui/Button";

interface StickyAddToCartProps {
  product: Product;
}

export function StickyAddToCart({ product }: StickyAddToCartProps) {
  const { addItem } = useCart();

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-30 border-t border-gray-200 bg-white p-4 shadow-2xl lg:hidden"
      style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
    >
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <p className="text-sm text-text-muted">{product.name}</p>
          <p className="font-bold text-primary">{product.priceLabel}</p>
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
            })
          }
        >
          <ShoppingCart className="h-5 w-5" />
          Añadir
        </Button>
      </div>
    </div>
  );
}
