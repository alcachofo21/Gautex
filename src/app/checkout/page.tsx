"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/lib/cart";
import { Button } from "@/components/ui/Button";

const stripeEnabled = Boolean(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

function CheckoutContent() {
  const searchParams = useSearchParams();
  const paymentSuccess = searchParams.get("success") === "true";
  const { items, clearCart } = useCart();
  const [mode, setMode] = useState<"checkout" | "quote">("quote");
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

  const handleQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "cart",
          items,
          ...form,
        }),
      });
      if (res.ok) {
        setStatus("success");
        clearCart();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const handleStripe = async () => {
    if (!stripeEnabled) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setMode("quote");
        setStatus("idle");
      }
    } catch {
      setStatus("error");
    }
  };

  if (items.length === 0 && status !== "success") {
    return (
      <div className="container-page py-20 text-center">
        <h1 className="font-display text-3xl font-bold">No hay productos en el carrito</h1>
        <Button href="/productos" className="mt-8">Ver productos</Button>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="container-page max-w-xl py-20 text-center">
        <h1 className="font-display text-3xl font-bold text-primary">
          {paymentSuccess ? "¡Pago completado!" : "¡Solicitud enviada!"}
        </h1>
        <p className="mt-4 text-text-muted">
          {paymentSuccess
            ? "Gracias por tu pedido. Recibirás confirmación por email."
            : "Hemos recibido tu solicitud de presupuesto. Te contactaremos pronto."}
        </p>
        <Button href="/productos" className="mt-8">Seguir comprando</Button>
      </div>
    );
  }

  return (
    <div className="py-12 sm:py-16">
      <div className="container-page max-w-2xl">
        <h1 className="text-fluid-title font-display font-bold">Checkout</h1>

        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6">
          <h2 className="font-semibold">Resumen ({items.length} productos)</h2>
          <ul className="mt-4 space-y-2">
            {items.map((item) => (
              <li key={item.productId} className="flex justify-between text-sm">
                <span>{item.name} × {item.quantity}</span>
                <span className="text-text-muted">{item.priceLabel}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 flex gap-3">
          {stripeEnabled && (
            <Button
              variant={mode === "checkout" ? "primary" : "outline"}
              onClick={() => { setMode("checkout"); handleStripe(); }}
              disabled={status === "loading"}
            >
              Pagar con Stripe
            </Button>
          )}
          <Button
            variant="primary"
            onClick={() => setMode("quote")}
          >
            Solicitar presupuesto B2B
          </Button>
        </div>

        {mode === "quote" && (
          <form onSubmit={handleQuote} className="mt-8 space-y-4 rounded-2xl border border-gray-200 bg-white p-6">
            <h2 className="font-semibold">Datos para presupuesto</h2>
            {[
              { key: "firstName", label: "Nombre *" },
              { key: "lastName", label: "Apellidos *" },
              { key: "email", label: "Email *", type: "email" },
              { key: "company", label: "Empresa" },
              { key: "cif", label: "CIF" },
              { key: "sector", label: "Sector (farmacia, hospital, distribuidor...)" },
            ].map((field) => (
              <div key={field.key}>
                <label className="mb-1 block text-sm font-medium">{field.label}</label>
                <input
                  type={field.type || "text"}
                  required={field.label.includes("*")}
                  value={form[field.key as keyof typeof form]}
                  onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                  className="w-full min-h-[48px] rounded-xl border border-gray-300 px-4 focus:border-primary focus:outline-none"
                />
              </div>
            ))}
            <div>
              <label className="mb-1 block text-sm font-medium">Mensaje</label>
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
            {status === "error" && <p className="text-sm text-red-500">Error al enviar.</p>}
            <Button type="submit" fullWidth disabled={status === "loading"}>
              {status === "loading" ? "Enviando..." : "Enviar solicitud de presupuesto"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="container-page py-20 text-center">Cargando...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
