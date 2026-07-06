"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, Minus, Plus, Trash2, ShoppingBag, Lock } from "lucide-react";
import { useCart } from "@/lib/cart";
import { Button } from "@/components/ui/Button";
import { getLocaleFromPath, getUi, localizedPath } from "@/lib/locale";
import { CartItemThumb } from "@/components/shop/CartItemThumb";
import { products } from "@/lib/products";

function formatEuro(value: number, locale: "es" | "en") {
  return value.toLocaleString(locale === "en" ? "en-IE" : "es-ES", {
    style: "currency",
    currency: "EUR",
  });
}

export function CartDrawer() {
  const pathname = usePathname();
  const locale = getLocaleFromPath(pathname);
  const ui = getUi(locale);
  const c = ui.cart;
  const { items, isOpen, closeCart, updateQuantity, removeItem, totalItems } = useCart();

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => {
    const price = products.find((p) => p.id === item.productId)?.price;
    return sum + (typeof price === "number" ? price * item.quantity : 0);
  }, 0);
  const hasQuoteItems = items.some((item) => {
    const price = products.find((p) => p.id === item.productId)?.price;
    return price === null || price === undefined;
  });

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50" onClick={closeCart} aria-hidden />
      <div
        className="absolute bottom-0 left-0 right-0 flex max-h-[92vh] flex-col rounded-t-3xl bg-white shadow-2xl lg:bottom-auto lg:left-auto lg:right-0 lg:top-0 lg:h-full lg:max-h-none lg:w-[440px] lg:rounded-none"
        role="dialog"
        aria-modal="true"
        aria-label={c.title}
      >
        <div className="flex items-center justify-between border-b border-line p-4">
          <h2 className="flex items-center gap-2 font-display text-xl font-bold">
            <ShoppingBag className="h-5 w-5 text-accent" />
            {c.title} ({totalItems()})
          </h2>
          <button
            type="button"
            onClick={closeCart}
            className="flex h-11 w-11 items-center justify-center rounded-lg hover:bg-surface"
            aria-label={c.close}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-surface text-text-muted">
                <ShoppingBag className="h-7 w-7" />
              </span>
              <p className="mt-4 font-semibold">{c.emptyTitle}</p>
              <p className="mt-1 text-sm text-text-muted">{c.emptyDesc}</p>
              <Button href={localizedPath("/productos", locale)} onClick={closeCart} className="mt-6">
                {c.viewProducts}
              </Button>
            </div>
          ) : (
            <ul className="space-y-3">
              {items.map((item) => (
                <li key={item.productId} className="flex gap-3 rounded-2xl border border-line p-3">
                  <CartItemThumb item={item} className="h-16 w-16 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{item.name}</p>
                    <p className="text-sm font-bold text-accent">{item.priceLabel}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="inline-flex items-center rounded-full border border-line">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="flex h-8 w-8 items-center justify-center rounded-l-full hover:bg-surface"
                          aria-label={c.decrease}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="flex h-8 w-8 items-center justify-center rounded-r-full hover:bg-surface"
                          aria-label={c.increase}
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.productId)}
                        className="ml-auto flex h-8 w-8 items-center justify-center rounded-lg text-red-500 hover:bg-red-50"
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
          <div className="border-t border-line p-4" style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}>
            {subtotal > 0 && (
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm text-text-muted">Subtotal</span>
                <span className="price text-lg">{formatEuro(subtotal, locale)}</span>
              </div>
            )}
            {hasQuoteItems && (
              <p className="mb-3 text-xs text-text-muted">{ui.payments.notPayable}</p>
            )}
            <Button href={localizedPath("/checkout", locale)} fullWidth onClick={closeCart}>
              {c.checkout}
            </Button>
            <Link
              href={localizedPath("/carrito", locale)}
              onClick={closeCart}
              className="mt-2 block text-center text-sm text-primary hover:underline"
            >
              {c.viewFull}
            </Link>
            <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-text-muted">
              <Lock className="h-3.5 w-3.5" />
              {ui.payments.secure}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
