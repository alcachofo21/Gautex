"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import type { Product } from "@/types";
import { useCart } from "@/lib/cart";
import { localizedPath, getUi, getCategories, type Locale } from "@/lib/locale";
import { trackEvent } from "@/lib/analytics";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ProductImage } from "./ProductImage";

interface ProductCardProps {
  product: Product;
  locale?: Locale;
  priority?: boolean;
}

export function ProductCard({ product, locale = "es", priority = false }: ProductCardProps) {
  const { addItem } = useCart();
  const ui = getUi(locale);
  const categoryName = getCategories(locale).find((c) => c.id === product.category)?.name ?? product.category;

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
  };

  return (
    <Link
      href={localizedPath(`/productos/${product.category}/${product.slug}`, locale)}
      className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
    >
      <ProductImage
        src={product.image}
        alt={product.name}
        color={product.color}
        className="aspect-square w-full"
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        priority={priority}
      />
      <div className="flex flex-1 flex-col p-4">
        <Badge variant="outline" className="mb-2 w-fit text-[10px]">
          {categoryName}
        </Badge>
        <h3 className="font-display font-bold text-text group-hover:text-primary">
          {product.name}
        </h3>
        <p className="mt-1 line-clamp-2 flex-1 text-sm text-text-muted">
          {product.shortDescription}
        </p>
        <div className="mt-4 flex items-center justify-between gap-2">
          <span className="font-semibold text-primary">{product.priceLabel}</span>
          <Button
            size="sm"
            variant="primary"
            onClick={handleAdd}
            className="shrink-0"
          >
            <ShoppingCart className="h-4 w-4" />
            <span className="hidden sm:inline">{ui.product.addToCart}</span>
          </Button>
        </div>
      </div>
    </Link>
  );
}
