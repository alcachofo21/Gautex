"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, Mail, MapPin, Printer } from "lucide-react";
import { AccordionItem } from "@/components/ui/Accordion";
import { getCorporate, getLocaleFromPath, getUi, localizedPath } from "@/lib/locale";

export function Footer() {
  const pathname = usePathname();
  const locale = getLocaleFromPath(pathname);
  const corporate = getCorporate(locale);
  const ui = getUi(locale);

  const footerSections = [
    {
      title: ui.footer.products,
      links: [
        { href: localizedPath("/productos/preventivo", locale), label: locale === "en" ? "Prevention" : "Material preventivo" },
        { href: localizedPath("/productos/ginecologia", locale), label: locale === "en" ? "Gynaecology" : "Ginecología" },
        { href: localizedPath("/productos/covid-19", locale), label: locale === "en" ? "COVID-19 tests" : "Tests COVID-19" },
        { href: localizedPath("/campanas", locale), label: ui.nav.campaigns },
      ],
    },
    {
      title: ui.footer.company,
      links: [
        { href: localizedPath("/nosotros", locale), label: ui.nav.about },
        { href: localizedPath("/calidad", locale), label: ui.nav.quality },
        { href: localizedPath("/colaboradores", locale), label: locale === "en" ? "Partners" : "Colaboradores" },
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

  return (
    <footer className="border-t border-gray-200 bg-text text-white">
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
            <p className="mt-4 text-sm text-white/70">{ui.footer.since} {corporate.company.founded}</p>
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
