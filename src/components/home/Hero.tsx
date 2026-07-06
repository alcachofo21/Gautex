"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ShieldCheck, Truck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { localizedPath, type Locale } from "@/lib/locale";

const copy = {
  es: {
    words: ["Calidad", "Confianza", "Profesionalidad", "Innovación"],
    with: "Con",
    title: "Repartiendo salud con productos",
    accent: "certificados CE",
    desc: "Distribución, comercialización y fabricación de productos sanitarios para farmacia y sector hospitalario en toda Europa.",
    shop: "Ver tienda",
    campaign: "Personalizar campaña",
    since: "Desde 2002",
    labels: ["Preservativos Matrix", "Preservativos Viva", "Max Gel", "Campañas"],
    trust: "Envío a toda Europa · Pago seguro",
  },
  en: {
    words: ["Quality", "Trust", "Professionalism", "Innovation"],
    with: "With",
    title: "Spreading health with",
    accent: "CE-certified products",
    desc: "Distribution, marketing and manufacturing of medical products for pharmacy and healthcare across Europe.",
    shop: "View shop",
    campaign: "Customise campaign",
    since: "Since 2002",
    labels: ["Matrix Condoms", "Viva Condoms", "Max Gel", "Campaigns"],
    trust: "Shipping across Europe · Secure payment",
  },
};

interface HeroProps {
  locale?: Locale;
}

export function Hero({ locale = "es" }: HeroProps) {
  const t = copy[locale];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % t.words.length);
    }, 2500);
    return () => clearInterval(timer);
  }, [t.words.length]);

  const gridItems = [
    {
      src: "/images/products/matrix-condoms.webp",
      label: t.labels[0],
      href: localizedPath("/productos/preventivo/matrix-condoms", locale),
    },
    {
      src: "/images/products/viva-condoms.webp",
      label: t.labels[1],
      href: localizedPath("/productos/preventivo/viva-condoms", locale),
    },
    {
      src: "/images/products/max-gel.webp",
      label: t.labels[2],
      href: localizedPath("/productos/preventivo/max-gel", locale),
    },
    {
      src: "/images/campaigns/estuche.webp",
      label: t.labels[3],
      href: localizedPath("/campanas", locale),
    },
  ];

  const badges = [
    { label: "CE 0120 SGS", className: "bg-white/20 text-white backdrop-blur" },
    { label: "ISO 13485", className: "bg-accent text-white shadow-sm shadow-accent/30" },
    { label: t.since, className: "bg-white/20 text-white backdrop-blur" },
  ];

  const ProductGrid = ({ className }: { className?: string }) => (
    <div className={className}>
      <div className="grid grid-cols-2 gap-3 sm:gap-3.5 lg:ml-auto lg:max-w-[24rem]">
        {gridItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="group overflow-hidden rounded-2xl border border-white/25 bg-white/10 p-2.5 backdrop-blur-md transition duration-300 hover:-translate-y-0.5 hover:border-accent/70 hover:bg-white/15 hover:shadow-xl hover:shadow-black/20"
          >
            <div className="relative aspect-[5/4] overflow-hidden rounded-xl bg-white/90">
              <Image
                src={item.src}
                alt={item.label}
                fill
                className="object-contain p-2 transition duration-300 group-hover:scale-105"
                sizes="(max-width: 1024px) 40vw, 180px"
                quality={80}
              />
            </div>
            <p className="mt-1.5 text-center text-xs font-semibold text-white group-hover:text-accent sm:text-sm">
              {item.label}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/images/hero/condones-seguro.webp"
          alt=""
          fill
          className="object-cover"
          priority
          sizes="100vw"
          quality={80}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/[0.97] via-primary/70 to-primary/20" />
        <div className="absolute inset-y-0 left-0 w-full max-w-3xl bg-gradient-to-r from-black/35 to-transparent lg:max-w-[55%]" />
      </div>

      <div className="container-page relative py-10 sm:py-12 lg:py-14 xl:py-16">
        <div className="grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 xl:gap-12">
          <div className="max-w-xl lg:max-w-none">
            <div className="mb-4 flex flex-wrap gap-2">
              {badges.map((badge) => (
                <span
                  key={badge.label}
                  className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${badge.className}`}
                >
                  {badge.label}
                </span>
              ))}
            </div>

            <h1 className="text-fluid-hero font-display font-bold text-white">
              {t.title} <span className="text-accent">{t.accent}</span>
            </h1>

            <div className="mt-3 flex h-8 items-center gap-2 text-base text-white/85 sm:text-lg">
              <span>{t.with}</span>
              <AnimatePresence mode="wait">
                <motion.span
                  key={t.words[index]}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35 }}
                  className="font-display font-bold text-accent"
                >
                  {t.words[index]}
                </motion.span>
              </AnimatePresence>
            </div>

            <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/80 sm:text-base">{t.desc}</p>

            <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:gap-3">
              <Button href={localizedPath("/productos", locale)} size="md" fullWidth className="sm:w-auto">
                {t.shop}
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                href={localizedPath("/campanas", locale)}
                variant="outline"
                size="md"
                fullWidth
                className="border-white/40 bg-white/10 text-white hover:border-white/60 hover:bg-white/20 sm:w-auto"
              >
                {t.campaign}
              </Button>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/75">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-accent" />
                CE · ISO 13485
              </span>
              <span className="flex items-center gap-1.5">
                <Truck className="h-4 w-4 text-accent" />
                {t.trust}
              </span>
            </div>
          </div>

          {/* Desktop grid */}
          <ProductGrid className="hidden lg:block" />

          {/* Mobile / tablet horizontal strip */}
          <div className="lg:hidden">
            <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
              {gridItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="group w-[42%] min-w-[9.5rem] shrink-0 overflow-hidden rounded-2xl border border-white/25 bg-white/10 p-2 backdrop-blur-md sm:w-[38%]"
                >
                  <div className="relative aspect-[5/4] overflow-hidden rounded-xl bg-white/90">
                    <Image
                      src={item.src}
                      alt={item.label}
                      fill
                      className="object-contain p-1.5"
                      sizes="150px"
                    />
                  </div>
                  <p className="mt-1 truncate text-center text-xs font-semibold text-white">{item.label}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
