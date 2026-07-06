"use client";

import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, Lock, Truck, ShieldCheck } from "lucide-react";
import { useCart } from "@/lib/cart";
import { Button } from "@/components/ui/Button";
import { getUi, localizedPath, type Locale } from "@/lib/locale";
import { CartItemThumb } from "@/components/shop/CartItemThumb";
import { products } from "@/lib/products";

interface CartPageContentProps {
  locale?: Locale;
}

function formatEuro(value: number, locale: "es" | "en") {
  return value.toLocaleString(locale === "en" ? "en-IE" : "es-ES", {
    style: "currency",
    currency: "EUR",
  });
}

export function CartPageContent({ locale = "es" }: CartPageContentProps) {
  const ui = getUi(locale);
  const c = ui.cart;
  const { items, updateQuantity, removeItem, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="container-page py-20 text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-surface text-text-muted">
          <ShoppingBag className="h-7 w-7" />
        </span>
        <h1 className="mt-6 font-display text-3xl font-bold">{c.emptyTitle}</h1>
        <p className="mt-3 text-text-muted">{c.emptyDesc}</p>
        <Button href={localizedPath("/productos", locale)} className="mt-8">
          {c.viewProducts}
        </Button>
      </div>
    );
  }

  const subtotal = items.reduce((sum, item) => {
    const price = products.find((p) => p.id === item.productId)?.price;
    return sum + (typeof price === "number" ? price * item.quantity : 0);
  }, 0);
  const hasQuoteItems = items.some((item) => {
    const price = products.find((p) => p.id === item.productId)?.price;
    return price === null || price === undefined;
  });

  return (
    <div className="py-10 sm:py-14">
      <div className="container-page">
        <h1 className="text-fluid-title font-display font-bold">{c.title}</h1>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
          <div>
            <ul className="space-y-4">
            {items.map((item) => (
              <li key={item.productId} className="flex gap-4 rounded-2xl border border-line bg-white p-4 shadow-sm">
                <CartItemThumb item={item} className="h-20 w-20 shrink-0" />
                <div className="min-w-0 flex-1">
                  <Link
                    href={localizedPath(`/productos/${item.category}/${item.slug}`, locale)}
                    className="font-semibold hover:text-accent"
                  >
                    {item.name}
                  </Link>
                  <p className="text-sm font-bold text-accent">{item.priceLabel}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <div className="inline-flex items-center rounded-full border border-line">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="flex h-9 w-9 items-center justify-center rounded-l-full hover:bg-surface"
                        aria-label={c.decrease}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-9 text-center font-semibold">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="flex h-9 w-9 items-center justify-center rounded-r-full hover:bg-surface"
                        aria-label={c.increase}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.productId)}
                      className="ml-auto flex items-center gap-1 text-sm text-red-500 hover:text-red-700"
                      aria-label={c.remove}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="hidden sm:inline">{c.remove}</span>
                    </button>
                  </div>
                </div>
              </li>
            ))}
            </ul>
            <button
              type="button"
              onClick={clearCart}
              className="mt-4 text-sm font-medium text-text-muted hover:text-red-500"
            >
              {c.clearCart}
            </button>
          </div>

          <aside className="h-fit rounded-2xl border border-line bg-surface p-6 lg:sticky lg:top-40">
            <h2 className="font-display text-lg font-bold">{ui.checkout.summary}</h2>
            {subtotal > 0 && (
              <div className="mt-4 flex items-center justify-between border-b border-line pb-4">
                <span className="text-text-muted">Subtotal</span>
                <span className="price text-2xl">{formatEuro(subtotal, locale)}</span>
              </div>
            )}
            {hasQuoteItems && <p className="mt-4 text-xs text-text-muted">{ui.payments.notPayable}</p>}
            <Button href={localizedPath("/checkout", locale)} fullWidth className="mt-5">
              {c.goCheckout}
            </Button>
            <ul className="mt-5 space-y-2 text-sm text-text-muted">
              <li className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-accent" />
                {ui.payments.secure}
              </li>
              <li className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-accent" />
                {ui.topbar.shipping}
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-accent" />
                CE 0120 · ISO 13485
              </li>
            </ul>
          </aside>
        </div>
      </div>
    </div>
  );
}
