"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/lib/cart";
import { Button } from "@/components/ui/Button";
import { InstantPaymentPanel } from "@/components/shop/InstantPaymentPanel";
import { getUi, localizedPath, type Locale } from "@/lib/locale";
import { trackEvent } from "@/lib/analytics";
import { formatEur } from "@/lib/payments/config";
import type { EnabledPaymentMethod } from "@/lib/payments/types";

interface CheckoutPageContentProps {
  locale?: Locale;
}

export function CheckoutPageContent({ locale = "es" }: CheckoutPageContentProps) {
  const searchParams = useSearchParams();
  const paymentSuccess = searchParams.get("success") === "true";
  const ui = getUi(locale);
  const t = ui.checkout;
  const p = ui.payments;
  const { items, clearCart } = useCart();
  const [methods, setMethods] = useState<EnabledPaymentMethod[]>([]);
  const [payable, setPayable] = useState(false);
  const [checkoutReady, setCheckoutReady] = useState(false);
  const [totalCents, setTotalCents] = useState(0);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    cif: "",
    sector: "",
    message: "",
    website: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  useEffect(() => {
    if (paymentSuccess) {
      setStatus("success");
      clearCart();
    }
  }, [paymentSuccess, clearCart]);

  useEffect(() => {
    if (items.length === 0) return;
    const q = encodeURIComponent(JSON.stringify(items));
    fetch(`/api/checkout?locale=${locale}&items=${q}`)
      .then((r) => r.json())
      .then((data) => {
        setMethods(data.methods || []);
        setPayable(Boolean(data.pricing?.payable));
        setCheckoutReady(Boolean(data.instantCheckoutEnabled));
        setTotalCents(data.pricing?.totalCents || 0);
      })
      .catch(() => {});
  }, [items, locale]);

  const handleQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "cart", items, locale, ...form }),
      });
      if (res.ok) {
        trackEvent("quote_request", { items: items.length });
        setStatus("success");
        clearCart();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const handlePayPal = async () => {
    setStatus("loading");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          locale,
          provider: "paypal",
          customerEmail: form.email || undefined,
        }),
      });
      const data = await res.json();
      if (data.url) {
        trackEvent("begin_checkout", { items: items.length, provider: "paypal" });
        window.location.href = data.url;
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (items.length === 0 && status !== "success") {
    return (
      <div className="container-page py-20 text-center">
        <h1 className="font-display text-3xl font-bold">{t.emptyTitle}</h1>
        <Button href={localizedPath("/productos", locale)} className="mt-8">
          {ui.cart.viewProducts}
        </Button>
      </div>
    );
  }

  if (status === "success") {
    const isPayment = paymentSuccess;
    return (
      <div className="container-page max-w-xl py-20 text-center">
        <h1 className="font-display text-3xl font-bold text-primary">
          {isPayment ? t.paymentSuccessTitle : t.quoteSuccessTitle}
        </h1>
        <p className="mt-4 text-text-muted">
          {isPayment ? t.paymentSuccessDesc : t.quoteSuccessDesc}
        </p>
        <Button href={localizedPath("/productos", locale)} className="mt-8">
          {t.continueShopping}
        </Button>
      </div>
    );
  }

  const formFields: { key: keyof typeof form; label: string; type?: string }[] = [
    { key: "firstName", label: t.fields.firstName },
    { key: "lastName", label: t.fields.lastName },
    { key: "email", label: t.fields.email, type: "email" },
    { key: "company", label: t.fields.company },
    { key: "cif", label: t.fields.cif },
    { key: "sector", label: t.fields.sector },
  ];

  return (
    <div className="py-12 sm:py-16">
      <div className="container-page max-w-2xl">
        <h1 className="text-fluid-title font-display font-bold">{t.title}</h1>

        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6">
          <h2 className="font-semibold">
            {t.summary} ({items.length} {t.items})
          </h2>
          <ul className="mt-4 space-y-2">
            {items.map((item) => (
              <li key={item.productId} className="flex justify-between text-sm">
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span className="text-text-muted">{item.priceLabel}</span>
              </li>
            ))}
          </ul>
        </div>

        <InstantPaymentPanel
          methods={methods}
          totalLabel={formatEur(totalCents, locale)}
          loading={status === "loading"}
          onPay={handlePayPal}
          payable={payable}
          checkoutReady={checkoutReady}
          labels={{
            title: p.instantTitle,
            subtitle: p.instantSubtitle,
            payNow: p.payNow,
            notPayable: p.notPayable,
            pendingSetup: p.pendingSetup,
            secure: p.secure,
          }}
        />

        <div className="relative my-8 text-center">
          <span className="bg-surface px-4 text-sm font-medium text-text-muted">{p.orQuote}</span>
          <div className="absolute inset-x-0 top-1/2 -z-10 border-t border-gray-200" />
        </div>

        <form onSubmit={handleQuote} className="space-y-4 rounded-2xl border border-gray-200 bg-white p-6">
          <h2 className="font-semibold">{t.quoteFormTitle}</h2>
          {formFields.map((field) => (
            <div key={field.key}>
              <label className="mb-1 block text-sm font-medium">{field.label}</label>
              <input
                type={field.type || "text"}
                required={field.label.includes("*")}
                value={form[field.key]}
                onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                className="w-full min-h-[48px] rounded-xl border border-gray-300 px-4 focus:border-primary focus:outline-none"
              />
            </div>
          ))}
          <div>
            <label className="mb-1 block text-sm font-medium">{t.fields.message}</label>
            <textarea
              rows={3}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full rounded-xl border border-gray-300 px-4 py-3"
            />
          </div>
          <input
            type="text"
            name="website"
            value={form.website}
            onChange={(e) => setForm({ ...form, website: e.target.value })}
            className="hidden"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden
          />
          {status === "error" && <p className="text-sm text-red-500">{t.error}</p>}
          <Button type="submit" fullWidth disabled={status === "loading"} variant="outline">
            {status === "loading" ? t.submitting : t.requestQuote}
          </Button>
        </form>
      </div>
    </div>
  );
}
