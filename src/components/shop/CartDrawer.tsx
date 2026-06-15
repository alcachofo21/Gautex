"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/lib/cart";
import { Button } from "@/components/ui/Button";
import { getLocaleFromPath, getUi } from "@/lib/locale";

export function CartDrawer() {
  const pathname = usePathname();
  const locale = getLocaleFromPath(pathname);
  const ui = getUi(locale);
  const c = ui.cart;
  const { items, isOpen, closeCart, updateQuantity, removeItem, totalItems } = useCart();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50" onClick={closeCart} aria-hidden />
      <div className="absolute bottom-0 left-0 right-0 flex max-h-[90vh] flex-col rounded-t-2xl bg-white shadow-2xl lg:bottom-auto lg:left-auto lg:right-0 lg:top-0 lg:h-full lg:max-h-none lg:w-[420px] lg:rounded-none">
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="font-display text-xl font-bold">
            {c.title} ({totalItems()})
          </h2>
          <button
            type="button"
            onClick={closeCart}
            className="flex h-11 w-11 items-center justify-center rounded-lg hover:bg-gray-100"
            aria-label={c.close}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <p className="py-12 text-center text-text-muted">{c.empty}</p>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li key={item.productId} className="flex gap-3 rounded-xl border p-3">
                  <div
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg font-bold text-white"
                    style={{ backgroundColor: item.color }}
                  >
                    {item.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-text-muted">{item.priceLabel}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border hover:bg-surface"
                        aria-label={c.decrease}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center font-semibold">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border hover:bg-surface"
                        aria-label={c.increase}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeItem(item.productId)}
                        className="ml-auto flex h-9 w-9 items-center justify-center rounded-lg text-red-500 hover:bg-red-50"
                        aria-label={c.remove}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t p-4" style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}>
            <Button href="/checkout" fullWidth onClick={closeCart}>
              {c.checkout}
            </Button>
            <Link
              href="/carrito"
              onClick={closeCart}
              className="mt-2 block text-center text-sm text-primary hover:underline"
            >
              {c.viewFull}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
