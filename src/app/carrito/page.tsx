"use client";

import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/lib/cart";
import { Button } from "@/components/ui/Button";

export default function CarritoPage() {
  const { items, updateQuantity, removeItem, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="container-page py-20 text-center">
        <h1 className="font-display text-3xl font-bold">Tu carrito está vacío</h1>
        <p className="mt-4 text-text-muted">Explora nuestro catálogo de productos sanitarios.</p>
        <Button href="/productos" className="mt-8">Ver productos</Button>
      </div>
    );
  }

  return (
    <div className="py-12 sm:py-16">
      <div className="container-page max-w-3xl">
        <h1 className="text-fluid-title font-display font-bold">Carrito</h1>

        <ul className="mt-8 space-y-4">
          {items.map((item) => (
            <li key={item.productId} className="flex gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <div
                className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl font-bold text-white"
                style={{ backgroundColor: item.color }}
              >
                {item.name.charAt(0)}
              </div>
              <div className="flex-1">
                <Link
                  href={`/productos/${item.category}/${item.slug}`}
                  className="font-semibold hover:text-primary"
                >
                  {item.name}
                </Link>
                <p className="text-sm text-text-muted">{item.priceLabel}</p>
                <div className="mt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-8 text-center font-semibold">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeItem(item.productId)}
                    className="ml-auto text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button href="/checkout" fullWidth>Ir a checkout</Button>
          <Button variant="outline" onClick={clearCart}>Vaciar carrito</Button>
        </div>
      </div>
    </div>
  );
}
