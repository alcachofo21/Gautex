"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/cart";
import { getLocaleFromPath, getSectors, getUi, localizedPath, sectorPath } from "@/lib/locale";
import { MobileNav } from "./MobileNav";
import { Button } from "@/components/ui/Button";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { NavDropdown, navLinkClass } from "./NavDropdown";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { totalItems, openCart } = useCart();
  const count = totalItems();
  const pathname = usePathname();
  const locale = getLocaleFromPath(pathname);
  const ui = getUi(locale);
  const sectors = getSectors(locale);

  const mainLinks = [
    { href: localizedPath("/productos", locale), label: ui.nav.shop },
    { href: localizedPath("/campanas", locale), label: ui.nav.campaigns },
    { href: localizedPath("/calidad", locale), label: ui.nav.quality },
    { href: localizedPath("/nosotros", locale), label: ui.nav.about },
    { href: localizedPath("/contacto", locale), label: ui.nav.contact },
  ];

  const sectorLinks = sectors.map((s) => ({
    href: sectorPath(s.id, locale),
    label: s.title,
  }));

  const moreLinks = [
    { href: localizedPath("/blog", locale), label: ui.nav.blog },
    { href: localizedPath("/recursos", locale), label: ui.nav.resources },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur-md">
        <div className="container-page flex h-24 items-center justify-between gap-4 lg:grid lg:h-[7.5rem] lg:grid-cols-[1fr_auto_1fr] lg:items-center">
          {/* Logo */}
          <Link
            href={localizedPath("/", locale)}
            className="flex shrink-0 items-center lg:justify-self-start"
            aria-label="Gautex Medica"
          >
            <Image
              src="/images/logo/gautex.webp"
              alt="Gautex Medica"
              width={512}
              height={512}
              className="h-[5.5rem] w-auto sm:h-24 lg:h-[6.5rem]"
              sizes="(max-width: 640px) 264px, 312px"
              quality={75}
              priority
            />
          </Link>

          {/* Nav centrada en desktop */}
          <nav
            className="hidden items-center justify-center gap-1 xl:gap-3 lg:flex lg:justify-self-center"
            aria-label="Main"
          >
            {mainLinks.slice(0, 2).map((link) => {
              const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={navLinkClass(active)}
                  aria-current={active ? "page" : undefined}
                >
                  {link.label}
                </Link>
              );
            })}
            <NavDropdown label={ui.nav.sectors} links={sectorLinks} />
            {mainLinks.slice(2, 4).map((link) => {
              const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={navLinkClass(active)}
                  aria-current={active ? "page" : undefined}
                >
                  {link.label}
                </Link>
              );
            })}
            <NavDropdown label={ui.nav.more} links={moreLinks} />
            {mainLinks.slice(4).map((link) => {
              const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={navLinkClass(active)}
                  aria-current={active ? "page" : undefined}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Acciones */}
          <div className="flex items-center justify-end gap-1 sm:gap-2 lg:justify-self-end">
            <LanguageSwitcher />
            <Button
              href={localizedPath("/contacto", locale)}
              variant="outline"
              size="sm"
              className="hidden lg:inline-flex"
            >
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
              aria-label={ui.a11y.menu}
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
