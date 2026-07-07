"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { getUi, type Locale } from "@/lib/locale";
import { trackEvent } from "@/lib/analytics";
import { readApiErrorMessage } from "@/lib/form-api";

interface ContactFormProps {
  locale?: Locale;
}

export function ContactForm({ locale = "es" }: ContactFormProps) {
  const ui = getUi(locale);
  const c = ui.contact;
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", message: "", website: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, type: "contact", locale }),
      });
      if (res.ok) {
        setStatus("success");
        setForm({ firstName: "", lastName: "", email: "", phone: "", message: "", website: "" });
        trackEvent("contact_submit");
      } else {
        setStatus("error");
        setErrorMessage(await readApiErrorMessage(res, c.error));
      }
    } catch {
      setStatus("error");
      setErrorMessage(c.error);
    }
  };

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-8">
        <h3 className="font-display text-xl font-bold text-primary">{c.successTitle}</h3>
        <p className="mt-2 text-text-muted">{c.successDesc}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">{c.fields.firstName}</label>
          <input required value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className="w-full min-h-[48px] rounded-xl border border-gray-300 px-4 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">{c.fields.lastName}</label>
          <input required value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className="w-full min-h-[48px] rounded-xl border border-gray-300 px-4 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">{c.fields.email}</label>
          <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full min-h-[48px] rounded-xl border border-gray-300 px-4 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">{c.fields.phone}</label>
          <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full min-h-[48px] rounded-xl border border-gray-300 px-4 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium">{c.fields.message}</label>
          <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
        </div>
      </div>
      <input type="text" name="website" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} className="hidden" tabIndex={-1} autoComplete="off" aria-hidden />
      {status === "error" && <p className="mt-4 text-sm text-red-500">{errorMessage || c.error}</p>}
      <Button type="submit" className="mt-6" disabled={status === "loading"}>
        {status === "loading" ? c.submitting : c.submit}
      </Button>
    </form>
  );
}
