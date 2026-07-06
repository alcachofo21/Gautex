"use client";

import Link from "next/link";
import { ShoppingCart, Check } from "lucide-react";
import { useState } from "react";
import type { Product } from "@/types";
import { useCart } from "@/lib/cart";
import { localizedPath, getUi, type Locale } from "@/lib/locale";
import { trackEvent } from "@/lib/analytics";
import { ProductImage } from "./ProductImage";

interface ProductCardProps {
  product: Product;
  locale?: Locale;
  priority?: boolean;
}

export function ProductCard({ product, locale = "es", priority = false }: ProductCardProps) {
  const { addItem } = useCart();
  const ui = getUi(locale);
  const [added, setAdded] = useState(false);
  const hasPrice = product.price !== null && product.price !== undefined;
  const unit = product.specs?.["Presentación"] ?? product.specs?.["Presentation"];

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      category: product.category,
      priceLabel: product.priceLabel,
      color: product.color,
      image: product.image,
    });
    trackEvent("add_to_cart", { product: product.id });
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  return (
    <Link
      href={localizedPath(`/productos/${product.category}/${product.slug}`, locale)}
      className="card-product group"
    >
      <div className="relative">
        {product.featured && (
          <span className="pill pill-soft absolute left-3 top-3 z-10">
            {locale === "en" ? "Best seller" : "Top ventas"}
          </span>
        )}
        {!hasPrice && (
          <span className="pill pill-new absolute right-3 top-3 z-10">B2B</span>
        )}
        <ProductImage
          src={product.image}
          alt={product.name}
          color={product.color}
          className="aspect-square w-full"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          priority={priority}
        />
      </div>

      <div className="flex flex-1 flex-col p-4">
        {unit && <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-text-muted">{unit}</p>}
        <h3 className="font-display font-bold leading-snug text-text group-hover:text-accent">{product.name}</h3>
        <p className="mt-1 line-clamp-2 flex-1 text-sm text-text-muted">{product.shortDescription}</p>

        <div className="mt-4 flex items-end justify-between gap-2">
          <div className="min-w-0">
            {hasPrice ? (
              <span className="price text-xl">{product.priceLabel}</span>
            ) : (
              <span className="text-sm font-bold text-primary">{product.priceLabel}</span>
            )}
          </div>
          <button
            type="button"
            onClick={handleAdd}
            aria-label={ui.product.addToCart}
            className={`flex h-10 shrink-0 items-center gap-1.5 rounded-full px-3 text-sm font-semibold text-white transition-colors ${
              added ? "bg-success" : "bg-accent hover:bg-accent-hover"
            }`}
          >
            {added ? <Check className="h-4 w-4" /> : <ShoppingCart className="h-4 w-4" />}
            <span className="hidden sm:inline">{added ? "" : ui.product.addToCart}</span>
          </button>
        </div>
      </div>
    </Link>
  );
}
