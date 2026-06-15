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
    { href: localizedPath("/campanas", locale), label: ui.nav.campaigns },
    { href: localizedPath("/calidad", locale), label: ui.nav.quality },
    { href: localizedPath("/nosotros", locale), label: ui.nav.about },
    { href: localizedPath("/contacto", locale), label: ui.nav.contact },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur-md">
        <div className="container-page flex h-16 items-center justify-between gap-3 lg:h-[4.25rem]">
          <Link href={localizedPath("/", locale)} className="flex shrink-0 items-center">
            <Image
              src="/images/logo/gautex.png"
              alt="Gautex Medica"
              width={220}
              height={220}
              className="h-11 w-auto sm:h-12 lg:h-[3.25rem]"
              sizes="(max-width: 640px) 132px, 156px"
              quality={95}
              priority
            />
          </Link>

          <nav className="hidden items-center gap-5 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-text-muted transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
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
              aria-label="Menu"
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
