"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import type { Product } from "@/types";
import { useCart } from "@/lib/cart";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      category: product.category,
      priceLabel: product.priceLabel,
      color: product.color,
    });
  };

  return (
    <Link
      href={`/productos/${product.category}/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
    >
      <div
        className="flex aspect-square items-center justify-center p-6"
        style={{ backgroundColor: `${product.color}15` }}
      >
        <div
          className="flex h-20 w-20 items-center justify-center rounded-2xl text-2xl font-bold text-white shadow-lg sm:h-24 sm:w-24"
          style={{ backgroundColor: product.color }}
        >
          {product.name.charAt(0)}
        </div>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <Badge variant="outline" className="mb-2 w-fit text-[10px]">
          {product.category}
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
            <span className="hidden sm:inline">Añadir</span>
          </Button>
        </div>
      </div>
    </Link>
  );
}
