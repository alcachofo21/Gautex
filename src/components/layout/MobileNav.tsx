"use client";

import Link from "next/link";
import { X, Phone, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { getCorporate, getUi, localizedPath, type Locale } from "@/lib/locale";

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
  locale: Locale;
}

export function MobileNav({ open, onClose, locale }: MobileNavProps) {
  const corporate = getCorporate(locale);
  const ui = getUi(locale);
  const c = ui.shopPage.collections;

  const collectionLinks = [
    { href: localizedPath("/productos?tipo=preservativos", locale), label: c.preservativos },
    { href: localizedPath("/productos?tipo=lubricantes", locale), label: c.lubricantes },
    { href: localizedPath("/productos?tipo=cubresondas", locale), label: c.cubresondas },
    { href: localizedPath("/productos?tipo=tests", locale), label: c.tests },
    { href: localizedPath("/productos?tipo=mascarillas", locale), label: c.mascarillas },
  ];

  const pageLinks = [
    { href: localizedPath("/productos", locale), label: ui.nav.shop },
    { href: localizedPath("/campanas", locale), label: ui.nav.campaigns },
    { href: localizedPath("/calidad", locale), label: ui.nav.quality },
    { href: localizedPath("/nosotros", locale), label: ui.nav.about },
    { href: localizedPath("/contacto", locale), label: ui.nav.contact },
    { href: localizedPath("/distribuidores", locale), label: ui.topbar.distributors },
  ];

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden />
      <nav className="absolute right-0 top-0 flex h-full w-[min(340px,88vw)] flex-col bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-line p-4">
          <span className="font-display text-lg font-bold text-primary">GAUTEX MEDICA</span>
          <button
            type="button"
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center rounded-lg hover:bg-gray-100"
            aria-label={ui.search.close}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <p className="text-eyebrow mb-2">{ui.nav.shop}</p>
          <div className="mb-6 grid grid-cols-2 gap-2">
            {collectionLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className="rounded-xl border border-line bg-surface px-3 py-3 text-sm font-semibold text-text hover:border-accent/40 hover:text-accent"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex flex-col gap-1">
            {pageLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className="min-h-[48px] rounded-lg px-3 py-3 text-base font-medium hover:bg-surface"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-2 border-t border-line p-4">
          <Button href={localizedPath("/campanas", locale)} fullWidth onClick={onClose}>
            <Sparkles className="h-5 w-5" />
            {ui.campaignsBlock.cta}
          </Button>
          <Button
            href={`tel:${corporate.company.phone.replace(/-/g, "")}`}
            variant="outline"
            fullWidth
            onClick={onClose}
          >
            <Phone className="h-5 w-5" />
            {corporate.company.phone}
          </Button>
        </div>
      </nav>
    </div>
  );
}
