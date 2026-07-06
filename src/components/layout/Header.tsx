"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, ShoppingCart, Phone, ChevronRight } from "lucide-react";
import { useCart } from "@/lib/cart";
import { getCorporate, getLocaleFromPath, getUi, localizedPath } from "@/lib/locale";
import { MobileNav } from "./MobileNav";
import { ProductSearch } from "@/components/shop/ProductSearch";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { totalItems, openCart } = useCart();
  const count = totalItems();
  const pathname = usePathname();
  const locale = getLocaleFromPath(pathname);
  const corporate = getCorporate(locale);
  const ui = getUi(locale);
  const c = ui.shopPage.collections;

  const collectionNav = [
    { href: localizedPath("/productos?tipo=preservativos", locale), label: c.preservativos },
    { href: localizedPath("/productos?tipo=lubricantes", locale), label: c.lubricantes },
    { href: localizedPath("/productos?tipo=cubresondas", locale), label: c.cubresondas },
    { href: localizedPath("/productos?tipo=tests", locale), label: c.tests },
    { href: localizedPath("/campanas", locale), label: ui.nav.campaigns },
  ];

  const secondaryNav = [
    { href: localizedPath("/calidad", locale), label: ui.nav.quality },
    { href: localizedPath("/nosotros", locale), label: ui.nav.about },
    { href: localizedPath("/contacto", locale), label: ui.nav.contact },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur-md">
        <div className="container-page flex h-20 items-center justify-between gap-4 lg:h-24">
          <Link href={localizedPath("/", locale)} className="flex shrink-0 items-center" aria-label="Gautex Medica">
            <Image
              src="/images/logo/gautex.webp"
              alt="Gautex Medica"
              width={440}
              height={440}
              className="h-16 w-auto sm:h-[4.5rem] lg:h-20"
              sizes="(max-width: 640px) 220px, 300px"
              quality={95}
              priority
            />
          </Link>

          <div className="hidden max-w-xl flex-1 lg:block">
            <ProductSearch variant="bar" />
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <a
              href={`tel:${corporate.company.phone.replace(/-/g, "")}`}
              className="hidden items-center gap-2 rounded-xl px-2 text-sm xl:flex"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-alt text-primary">
                <Phone className="h-4 w-4" />
              </span>
              <span className="leading-tight">
                <span className="block text-[11px] text-text-muted">{corporate.company.schedule[locale]}</span>
                <span className="block font-bold text-primary">{corporate.company.phone}</span>
              </span>
            </a>

            <LanguageSwitcher />

            <div className="lg:hidden">
              <ProductSearch variant="icon" />
            </div>

            <button
              type="button"
              onClick={openCart}
              className="relative flex h-11 items-center gap-2 rounded-xl bg-primary px-3 font-semibold text-white transition-colors hover:bg-primary-dark"
              aria-label={ui.nav.cart}
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="hidden text-sm sm:inline">{ui.nav.cart}</span>
              {count > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-xs font-bold text-white">
                  {count}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="flex h-11 w-11 items-center justify-center rounded-xl hover:bg-surface lg:hidden"
              aria-label={ui.a11y.menu}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>

        <nav className="hidden border-t border-line lg:block">
          <div className="container-page flex items-center gap-1">
            <Link
              href={localizedPath("/productos", locale)}
              className="flex items-center gap-1.5 py-3 pr-5 text-sm font-bold text-primary"
            >
              {ui.nav.shop}
            </Link>
            <span className="h-4 w-px bg-line" />
            {collectionNav.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-3 text-sm font-semibold text-text transition-colors hover:text-accent"
              >
                {link.label}
              </Link>
            ))}
            <span className="mx-1 h-4 w-px bg-line" />
            {secondaryNav.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-3 text-sm font-medium text-text-muted transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={localizedPath("/distribuidores", locale)}
              className="ml-auto flex items-center gap-1 py-3 text-sm font-semibold text-accent hover:underline"
            >
              {ui.topbar.distributors}
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </nav>
      </header>
      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} locale={locale} />
    </>
  );
}
