"use client";

import Link from "next/link";
import { X, Phone } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { getCorporate, getSectors, getUi, localizedPath, sectorPath, type Locale } from "@/lib/locale";

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
  locale: Locale;
}

export function MobileNav({ open, onClose, locale }: MobileNavProps) {
  const corporate = getCorporate(locale);
  const ui = getUi(locale);
  const sectors = getSectors(locale);

  const navLinks = [
    { href: localizedPath("/productos", locale), label: ui.nav.shop },
    { href: localizedPath("/campanas", locale), label: ui.nav.campaigns },
    { href: localizedPath("/calidad", locale), label: ui.nav.quality },
    { href: localizedPath("/nosotros", locale), label: ui.nav.about },
    { href: localizedPath("/blog", locale), label: ui.nav.blog },
    { href: localizedPath("/recursos", locale), label: ui.nav.resources },
    { href: localizedPath("/contacto", locale), label: ui.nav.contact },
  ];

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden />
      <nav
        className="absolute right-0 top-0 flex h-full w-[min(320px,85vw)] flex-col bg-white shadow-2xl"
        aria-label="Mobile"
      >
        <div className="flex items-center justify-between border-b px-4 py-3">
          <span className="font-display text-base font-bold text-primary">GAUTEX MEDICA</span>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-gray-100"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className="min-h-[44px] rounded-lg px-3 py-2.5 text-base font-medium hover:bg-surface"
            >
              {link.label}
            </Link>
          ))}
          <p className="mt-3 px-3 text-xs font-semibold uppercase tracking-wide text-text-muted">
            {ui.nav.sectors}
          </p>
          {sectors.map((sector) => (
            <Link
              key={sector.id}
              href={sectorPath(sector.id, locale)}
              onClick={onClose}
              className="min-h-[40px] rounded-lg px-3 py-2 text-sm text-text-muted hover:bg-surface hover:text-primary"
            >
              {sector.title}
            </Link>
          ))}
        </div>
        <div className="space-y-2 border-t p-4">
          <Button href={localizedPath("/contacto", locale)} fullWidth onClick={onClose}>
            {ui.nav.quote}
          </Button>
          <Button
            href={`tel:${corporate.company.phone.replace(/-/g, "")}`}
            variant="secondary"
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
