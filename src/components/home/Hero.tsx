"use client";

import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Truck, Lock, Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { localizedPath, type Locale } from "@/lib/locale";

const copy = {
  es: {
    eyebrow: "Salud sexual e higiene · Desde 2002",
    title: "Preservativos, lubricantes y cubresondas",
    accent: "con garantía sanitaria",
    desc: "Tu tienda online de productos sanitarios certificados CE. Preservativos de látex natural, lubricantes de base acuosa, cubresondas y material hospitalario, listos para pedir.",
    shop: "Comprar preservativos",
    catalog: "Ver catálogo completo",
    trust: [
      { icon: ShieldCheck, text: "Certificado CE 0120 · ISO 13485" },
      { icon: Truck, text: "Envío a toda Europa" },
      { icon: Lock, text: "Pago seguro y embalaje discreto" },
    ],
    rating: "Confían distribuidores, farmacias y entidades de salud pública",
    cards: [
      { src: "/images/products/matrix-condoms.webp", label: "Matrix Condoms", href: "/productos/preventivo/matrix-condoms" },
      { src: "/images/products/max-gel.webp", label: "Max Gel lubricante", href: "/productos/preventivo/max-gel" },
      { src: "/images/products/gecofun.webp", label: "Cubresonda Gecofun", href: "/productos/ginecologia/gecofun" },
      { src: "/images/products/viva-condoms.webp", label: "Viva Condoms", href: "/productos/preventivo/viva-condoms" },
    ],
  },
  en: {
    eyebrow: "Sexual health & hygiene · Since 2002",
    title: "Condoms, lubricants and probe covers",
    accent: "with medical-grade assurance",
    desc: "Your online shop for CE-certified medical products. Natural latex condoms, water-based lubricants, ultrasound probe covers and hospital supplies, ready to order.",
    shop: "Shop condoms",
    catalog: "Browse full catalogue",
    trust: [
      { icon: ShieldCheck, text: "CE 0120 certified · ISO 13485" },
      { icon: Truck, text: "Shipping across Europe" },
      { icon: Lock, text: "Secure payment & discreet packaging" },
    ],
    rating: "Trusted by distributors, pharmacies and public health entities",
    cards: [
      { src: "/images/products/matrix-condoms.webp", label: "Matrix Condoms", href: "/productos/preventivo/matrix-condoms" },
      { src: "/images/products/max-gel.webp", label: "Max Gel lubricant", href: "/productos/preventivo/max-gel" },
      { src: "/images/products/gecofun.webp", label: "Gecofun probe cover", href: "/productos/ginecologia/gecofun" },
      { src: "/images/products/viva-condoms.webp", label: "Viva Condoms", href: "/productos/preventivo/viva-condoms" },
    ],
  },
};

interface HeroProps {
  locale?: Locale;
}

export function Hero({ locale = "es" }: HeroProps) {
  const t = copy[locale];

  return (
    <section className="relative overflow-hidden bg-primary">
      <div className="absolute inset-0">
        <Image src="/images/hero/condones-seguro.webp" alt="" fill className="object-cover opacity-25" priority sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/95 to-primary-dark" />
      </div>

      <div className="container-page relative py-12 sm:py-16 lg:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <span className="text-eyebrow text-accent">{t.eyebrow}</span>
            <h1 className="text-fluid-hero mt-3 font-display font-extrabold text-white">
              {t.title} <span className="text-accent">{t.accent}</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">{t.desc}</p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button href={localizedPath("/productos?tipo=preservativos", locale)} size="lg" className="sm:w-auto">
                {t.shop}
                <ArrowRight className="h-5 w-5" />
              </Button>
              <Button
                href={localizedPath("/productos", locale)}
                variant="outline"
                size="lg"
                className="border-white/40 text-white hover:border-white hover:bg-white/10 sm:w-auto"
              >
                {t.catalog}
              </Button>
            </div>

            <div className="mt-7 flex items-center gap-1.5 text-sm text-white/75">
              <span className="flex text-accent">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </span>
              <span className="ml-1">{t.rating}</span>
            </div>

            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
              {t.trust.map((item) => (
                <span key={item.text} className="flex items-center gap-2 text-sm text-white/80">
                  <item.icon className="h-4 w-4 text-accent" />
                  {item.text}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {t.cards.map((card, i) => (
              <Link
                key={card.label}
                href={localizedPath(card.href, locale)}
                className={`group relative overflow-hidden rounded-2xl bg-white p-3 shadow-xl transition-transform hover:-translate-y-1 ${
                  i === 0 ? "sm:mt-6" : ""
                } ${i === 3 ? "sm:-mt-6" : ""}`}
              >
                <div className="relative aspect-square overflow-hidden rounded-xl bg-surface">
                  <Image
                    src={card.src}
                    alt={card.label}
                    fill
                    className="object-contain p-3 transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 45vw, 200px"
                  />
                </div>
                <p className="mt-2 text-center text-sm font-bold text-primary group-hover:text-accent">{card.label}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
