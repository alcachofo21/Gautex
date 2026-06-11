"use client";

import Link from "next/link";
import { X, Phone } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { corporate } from "@/lib/products";

const navLinks = [
  { href: "/productos", label: "Tienda" },
  { href: "/campanas", label: "Campañas" },
  { href: "/productos", label: "Productos" },
  { href: "/calidad", label: "Calidad" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/contacto", label: "Contacto" },
];

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

export function MobileNav({ open, onClose }: MobileNavProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden />
      <nav className="absolute right-0 top-0 flex h-full w-[min(320px,85vw)] flex-col bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b p-4">
          <span className="font-display text-lg font-bold text-primary">GAUTEX MEDICA</span>
          <button type="button" onClick={onClose} className="flex h-11 w-11 items-center justify-center rounded-lg hover:bg-gray-100" aria-label="Cerrar menú">
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="flex flex-1 flex-col gap-1 p-4">
          {navLinks.map((link) => (
            <Link
              key={link.href + link.label}
              href={link.href}
              onClick={onClose}
              className="min-h-[48px] rounded-lg px-4 py-3 text-lg font-medium hover:bg-surface"
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="border-t p-4">
          <Button
            href={`tel:${corporate.company.phone.replace(/-/g, "")}`}
            variant="secondary"
            fullWidth
            onClick={onClose}
          >
            <Phone className="h-5 w-5" />
            Llamar {corporate.company.phone}
          </Button>
        </div>
      </nav>
    </div>
  );
}
