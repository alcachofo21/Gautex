"use client";

import { useState } from "react";
import { ShoppingCart, Minus, Plus, Check } from "lucide-react";
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
  const { addItem, openCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const hasPrice = product.price !== null && product.price !== undefined;

  const handleAdd = () => {
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
    setAdded(true);
    openCart();
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="inline-flex items-center rounded-full border border-line bg-white">
        <button
          type="button"
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          className="flex h-12 w-12 items-center justify-center rounded-l-full text-text-muted hover:text-primary"
          aria-label={ui.cart.decrease}
        >
          <Minus className="h-4 w-4" />
        </button>
        <input
          type="number"
          min={1}
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
          className="h-12 w-12 border-x border-line bg-transparent text-center font-semibold outline-none"
          aria-label={ui.cart.quantity}
        />
        <button
          type="button"
          onClick={() => setQuantity((q) => q + 1)}
          className="flex h-12 w-12 items-center justify-center rounded-r-full text-text-muted hover:text-primary"
          aria-label={ui.cart.increase}
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {hasPrice ? (
        <Button onClick={handleAdd} size="lg" className="sm:flex-1">
          {added ? <Check className="h-5 w-5" /> : <ShoppingCart className="h-5 w-5" />}
          {added ? (locale === "en" ? "Added" : "Añadido") : p.addToCartFull}
        </Button>
      ) : (
        <>
          <Button href={localizedPath("/contacto", locale)} size="lg" className="sm:flex-1">
            {p.requestQuote}
          </Button>
          <Button onClick={handleAdd} variant="outline" size="lg">
            <ShoppingCart className="h-5 w-5" />
            {p.addToCart}
          </Button>
        </>
      )}
    </div>
  );
}
