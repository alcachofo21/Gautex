"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, Mail, MapPin, Printer, ShieldCheck, Truck, Lock, CreditCard } from "lucide-react";
import { AccordionItem } from "@/components/ui/Accordion";
import { getCorporate, getLocaleFromPath, getUi, localizedPath } from "@/lib/locale";

export function Footer() {
  const pathname = usePathname();
  const locale = getLocaleFromPath(pathname);
  const corporate = getCorporate(locale);
  const ui = getUi(locale);
  const c = ui.shopPage.collections;

  const footerSections = [
    {
      title: ui.footer.products,
      links: [
        { href: localizedPath("/productos?tipo=preservativos", locale), label: c.preservativos },
        { href: localizedPath("/productos?tipo=lubricantes", locale), label: c.lubricantes },
        { href: localizedPath("/productos?tipo=cubresondas", locale), label: c.cubresondas },
        { href: localizedPath("/productos?tipo=tests", locale), label: c.tests },
        { href: localizedPath("/campanas", locale), label: ui.nav.campaigns },
      ],
    },
    {
      title: ui.footer.company,
      links: [
        { href: localizedPath("/nosotros", locale), label: ui.nav.about },
        { href: localizedPath("/calidad", locale), label: ui.nav.quality },
        { href: localizedPath("/colaboradores", locale), label: locale === "en" ? "Partners" : "Colaboradores" },
        { href: localizedPath("/distribuidores", locale), label: ui.topbar.distributors },
        { href: localizedPath("/contacto", locale), label: ui.nav.contact },
      ],
    },
    {
      title: ui.footer.legal,
      links: [
        { href: localizedPath("/legal/privacidad", locale), label: ui.footer.privacy },
        { href: localizedPath("/legal/cookies", locale), label: ui.footer.cookies },
        { href: localizedPath("/legal/terminos", locale), label: ui.footer.terms },
      ],
    },
  ];

  const trust = [
    { icon: ShieldCheck, text: locale === "en" ? "CE 0120 · ISO 13485" : "CE 0120 · ISO 13485" },
    { icon: Truck, text: ui.topbar.shipping },
    { icon: Lock, text: ui.payments.secure },
  ];

  return (
    <footer className="border-t border-line bg-text text-white">
      <div className="border-b border-white/10">
        <div className="container-page grid gap-4 py-6 sm:grid-cols-3">
          {trust.map((item) => (
            <div key={item.text} className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-accent">
                <item.icon className="h-5 w-5" />
              </span>
              <span className="text-sm text-white/85">{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="container-page py-12">
        <div className="mb-8 lg:hidden">
          {footerSections.map((section) => (
            <AccordionItem key={section.title} title={section.title}>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-white/70 hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </AccordionItem>
          ))}
        </div>

        <div className="hidden gap-8 lg:grid lg:grid-cols-4">
          <div>
            <p className="font-display text-xl font-bold">GAUTEX MEDICA</p>
            <p className="mt-2 text-sm text-white/70">{corporate.company.slogan}</p>
            <p className="mt-4 text-sm text-white/70">
              {ui.footer.since} {corporate.company.founded}
            </p>
            <div className="mt-5 flex items-center gap-2 text-white/60">
              <CreditCard className="h-5 w-5" />
              <span className="text-xs">Visa · Mastercard · Amex · Apple Pay · PayPal</span>
            </div>
          </div>
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="mb-4 font-semibold">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-white/70 hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-4 border-t border-white/20 pt-8 sm:flex-row sm:flex-wrap sm:gap-6">
          <a href={`tel:${corporate.company.phone.replace(/-/g, "")}`} className="flex items-center gap-2 text-sm text-white/80 hover:text-white">
            <Phone className="h-4 w-4" />
            {corporate.company.phone}
          </a>
          <a href={`mailto:${corporate.company.email}`} className="flex items-center gap-2 text-sm text-white/80 hover:text-white">
            <Mail className="h-4 w-4" />
            {corporate.company.email}
          </a>
          <span className="flex items-center gap-2 text-sm text-white/80">
            <Printer className="h-4 w-4" />
            Fax: {corporate.company.fax}
          </span>
          <span className="flex items-center gap-2 text-sm text-white/80">
            <MapPin className="h-4 w-4" />
            {corporate.company.address}
          </span>
        </div>

        <p className="mt-6 text-center text-xs text-white/50">
          © {new Date().getFullYear()} {corporate.company.name} — {ui.footer.rights}
        </p>
      </div>
    </footer>
  );
}
