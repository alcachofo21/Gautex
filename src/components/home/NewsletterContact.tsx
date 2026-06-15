"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { getCorporate, getUi, localizedPath, type Locale } from "@/lib/locale";

interface NewsletterContactProps {
  locale?: Locale;
}

export function NewsletterContact({ locale = "es" }: NewsletterContactProps) {
  const corporate = getCorporate(locale);
  const ui = getUi(locale);
  const n = ui.newsletter;
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
          lastName: locale === "en" ? "Subscriber" : "Suscriptor",
          email,
          message: locale === "en" ? "Newsletter subscription" : "Suscripción al newsletter",
          type: "newsletter",
        }),
      });
      setStatus(res.ok ? "success" : "error");
      if (res.ok) setEmail("");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className="py-12 sm:py-16">
      <div className="container-page">
        <div className="grid gap-8 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm lg:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl font-bold">{n.title}</h2>
            <p className="mt-2 text-text-muted">{n.desc}</p>
            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={n.placeholder}
                className="min-h-[48px] flex-1 rounded-xl border border-gray-300 px-4 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <Button type="submit">{n.submit}</Button>
            </form>
            {status === "success" && <p className="mt-2 text-sm text-primary">{n.success}</p>}
            {status === "error" && <p className="mt-2 text-sm text-red-500">{n.error}</p>}
          </div>
          <div className="flex flex-col justify-center border-t border-gray-200 pt-8 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
            <h3 className="font-display text-xl font-bold">{n.quickContact}</h3>
            <p className="mt-2 text-text-muted">{corporate.company.schedule[locale]}</p>
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
            <p className="mt-2 text-sm text-text-muted">
              {corporate.company.street}, {corporate.company.floor}, {corporate.company.office}
              <br />
              {corporate.company.postalCode} {corporate.company.city}
            </p>
            <Button href={localizedPath("/contacto", locale)} variant="secondary" className="mt-6 w-fit">
              {n.contactForm}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
