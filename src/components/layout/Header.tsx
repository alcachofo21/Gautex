"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, ShoppingCart, Phone } from "lucide-react";
import { useCart } from "@/lib/cart";
import { getCorporate, getLocaleFromPath, getUi, localizedPath } from "@/lib/locale";
import { MobileNav } from "./MobileNav";
import { Button } from "@/components/ui/Button";
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

  const navLinks = [
    { href: localizedPath("/productos", locale), label: ui.nav.shop },
    { href: localizedPath("/distribuidores", locale), label: ui.nav.distributors, highlight: true },
    { href: localizedPath("/campanas", locale), label: ui.nav.campaigns },
    { href: localizedPath("/calidad", locale), label: ui.nav.quality },
    { href: localizedPath("/nosotros", locale), label: ui.nav.about },
    { href: localizedPath("/contacto", locale), label: ui.nav.contact },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 overflow-hidden border-b border-gray-200 bg-white/95 backdrop-blur-md">
        <div className="container-page flex h-24 items-center justify-between gap-3 lg:h-[7.5rem]">
          <Link href={localizedPath("/", locale)} className="flex shrink-0 items-center">
            <Image
              src="/images/logo/gautex.png"
              alt="Gautex Medica"
              width={440}
              height={440}
              className="h-[5.5rem] w-auto sm:h-24 lg:h-[6.5rem]"
              sizes="(max-width: 640px) 264px, 312px"
              quality={95}
              priority
            />
          </Link>

          <nav className="hidden items-center gap-5 lg:flex">
            {navLinks.map((link) => {
              const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors ${
                    active
                      ? "text-primary"
                      : link.highlight
                        ? "font-semibold text-accent hover:text-accent-hover"
                        : "text-text-muted hover:text-primary"
                  }`}
                  aria-current={active ? "page" : undefined}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
            <LanguageSwitcher />
            <ProductSearch />
            <a
              href={`tel:${corporate.company.phone.replace(/-/g, "")}`}
              className="hidden items-center gap-1 text-sm font-semibold text-primary md:flex"
            >
              <Phone className="h-4 w-4" />
              {corporate.company.phone}
            </a>
            <Button href={localizedPath("/distribuidores", locale)} variant="secondary" size="sm" className="hidden md:inline-flex">
              {ui.nav.distributors}
            </Button>
            <Button href={localizedPath("/contacto", locale)} variant="outline" size="sm" className="hidden sm:inline-flex">
              {ui.nav.quote}
            </Button>
            <button
              type="button"
              onClick={openCart}
              className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-surface hover:bg-gray-200"
              aria-label={ui.nav.cart}
            >
              <ShoppingCart className="h-5 w-5" />
              {count > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">
                  {count}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="flex h-11 w-11 items-center justify-center rounded-xl hover:bg-surface lg:hidden"
              aria-label={getUi(locale).a11y.menu}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>
      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} locale={locale} />
    </>
  );
}
