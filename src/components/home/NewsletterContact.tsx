"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { corporate } from "@/lib/products";

export function NewsletterContact() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: "Newsletter",
          lastName: "Suscriptor",
          email,
          message: "Suscripción al newsletter",
          type: "newsletter",
        }),
      });
      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className="py-12 sm:py-16">
      <div className="container-page">
        <div className="grid gap-8 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm lg:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl font-bold">Mantente informado</h2>
            <p className="mt-2 text-text-muted">
              Recibe novedades de catálogo y productos sanitarios.
            </p>
            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="min-h-[48px] flex-1 rounded-xl border border-gray-300 px-4 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <Button type="submit">Suscribirse</Button>
            </form>
            {status === "success" && (
              <p className="mt-2 text-sm text-primary">¡Gracias por suscribirte!</p>
            )}
            {status === "error" && (
              <p className="mt-2 text-sm text-red-500">Error al enviar. Inténtalo de nuevo.</p>
            )}
          </div>
          <div className="flex flex-col justify-center border-t border-gray-200 pt-8 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
            <h3 className="font-display text-xl font-bold">Contacto rápido</h3>
            <p className="mt-2 text-text-muted">{corporate.company.schedule.es}</p>
            <p className="mt-4">
              <a href={`tel:${corporate.company.phone.replace(/-/g, "")}`} className="font-semibold text-primary hover:underline">
                {corporate.company.phone}
              </a>
            </p>
            <p>
              <a href={`mailto:${corporate.company.email}`} className="text-primary hover:underline">
                {corporate.company.email}
              </a>
            </p>
            <Button href="/contacto" variant="secondary" className="mt-6 w-fit">
              Formulario de contacto
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
