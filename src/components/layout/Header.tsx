"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, ShoppingCart, Phone } from "lucide-react";
import { useCart } from "@/lib/cart";
import { corporate } from "@/lib/products";
import { MobileNav } from "./MobileNav";
import { Button } from "@/components/ui/Button";

const navLinks = [
  { href: "/productos", label: "Tienda" },
  { href: "/campanas", label: "Campañas" },
  { href: "/productos", label: "Productos" },
  { href: "/calidad", label: "Calidad" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/contacto", label: "Contacto" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { totalItems, openCart } = useCart();
  const count = totalItems();

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur-md">
        <div className="container-page flex h-16 items-center justify-between gap-4 lg:h-20">
          <Link href="/" className="font-display text-lg font-bold text-primary sm:text-xl">
            GAUTEX <span className="text-text">MEDICA</span>
          </Link>

          <nav className="hidden items-center gap-6 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href + link.label}
                href={link.href}
                className="text-sm font-medium text-text-muted transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href={`tel:${corporate.company.phone.replace(/-/g, "")}`}
              className="hidden items-center gap-1 text-sm font-semibold text-primary md:flex"
            >
              <Phone className="h-4 w-4" />
              {corporate.company.phone}
            </a>
            <Button href="/contacto" variant="outline" size="sm" className="hidden sm:inline-flex">
              Presupuesto
            </Button>
            <button
              type="button"
              onClick={openCart}
              className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-surface hover:bg-gray-200"
              aria-label="Abrir carrito"
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
              aria-label="Abrir menú"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>
      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
