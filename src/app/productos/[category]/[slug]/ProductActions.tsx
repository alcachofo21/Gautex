"use client";

import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import type { Product } from "@/types";
import { useCart } from "@/lib/cart";
import { canPurchaseOnline } from "@/lib/products";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
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
  const purchasable = canPurchaseOnline(product);
  const maxQty = purchasable && product.stockQuantity != null ? product.stockQuantity : undefined;

  return (
    <div className="mt-6 flex flex-col gap-4">
      {product.stockQuantity != null && purchasable && (
        <Badge className="w-fit bg-emerald-50 text-emerald-800">
          {p.inStock.replace("{n}", String(product.stockQuantity))}
        </Badge>
      )}
      {!purchasable && product.price === null && (
        <p className="text-sm text-text-muted">{p.quoteOnlyHint}</p>
      )}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        {purchasable && (
          <>
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium">{ui.cart.quantity}</label>
              <input
                type="number"
                min={1}
                max={maxQty}
                value={quantity}
                onChange={(e) => {
                  const n = Math.max(1, parseInt(e.target.value) || 1);
                  setQuantity(maxQty ? Math.min(n, maxQty) : n);
                }}
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
          </>
        )}
        <Button href={localizedPath("/contacto", locale)} variant="outline">
          {p.requestQuote}
        </Button>
      </div>
    </div>
  );
}
