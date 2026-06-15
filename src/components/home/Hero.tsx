"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
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
    labels: ["Matrix Condoms", "Viva Condoms", "Max Gel", "Campañas"],
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
  },
};

interface HeroProps {
  locale?: Locale;
}

export function Hero({ locale = "es" }: HeroProps) {
  const t = copy[locale];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % t.words.length);
    }, 2500);
    return () => clearInterval(timer);
  }, [t.words.length]);

  const gridItems = [
    {
      src: "/images/products/matrix-condoms.png",
      label: t.labels[0],
      href: localizedPath("/productos/preventivo/matrix-condoms", locale),
    },
    {
      src: "/images/products/viva-condoms.png",
      label: t.labels[1],
      href: localizedPath("/productos/preventivo/viva-condoms", locale),
    },
    {
      src: "/images/products/max-gel.png",
      label: t.labels[2],
      href: localizedPath("/productos/preventivo/max-gel", locale),
    },
    {
      src: "/images/campaigns/estuche.png",
      label: t.labels[3],
      href: localizedPath("/campanas", locale),
    },
  ];

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/images/hero/condones-seguro.png"
          alt=""
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-primary/25" />
        <div className="absolute inset-y-0 left-0 w-full max-w-3xl bg-gradient-to-r from-primary/40 to-transparent lg:max-w-[55%]" />
      </div>

      <div className="container-page relative py-16 sm:py-24 lg:py-32">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <div className="mb-4 flex flex-wrap gap-2">
              <Badge className="bg-white/20 text-white backdrop-blur">CE 0120 SGS</Badge>
              <Badge className="bg-accent/90 text-white">ISO 13485</Badge>
              <Badge className="bg-white/20 text-white backdrop-blur">{t.since}</Badge>
            </div>

            <h1 className="text-fluid-hero font-display font-bold leading-tight text-white">
              {t.title}{" "}
              <span className="text-accent">{t.accent}</span>
            </h1>

            <div className="mt-4 flex h-10 items-center gap-2 text-lg text-white/80 sm:text-xl">
              <span>{t.with}</span>
              <AnimatePresence mode="wait">
                <motion.span
                  key={t.words[index]}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="font-display font-bold text-accent"
                >
                  {t.words[index]}
                </motion.span>
              </AnimatePresence>
            </div>

            <p className="mt-6 max-w-xl text-base text-white/75 sm:text-lg">{t.desc}</p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href={localizedPath("/productos", locale)} size="lg" fullWidth className="sm:w-auto">
                {t.shop}
              </Button>
              <Button
                href={localizedPath("/campanas", locale)}
                variant="outline"
                size="lg"
                fullWidth
                className="border-white/40 bg-white/10 text-white hover:bg-white/20 sm:w-auto"
              >
                {t.campaign}
              </Button>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="grid grid-cols-2 gap-4">
              {gridItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="group overflow-hidden rounded-2xl border border-white/20 bg-white/10 p-3 backdrop-blur transition hover:border-accent/60 hover:bg-white/20 hover:shadow-lg"
                >
                  <div className="relative aspect-square overflow-hidden rounded-xl">
                    <Image
                      src={item.src}
                      alt={item.label}
                      fill
                      className="object-cover transition duration-300 group-hover:scale-105"
                      sizes="200px"
                    />
                  </div>
                  <p className="mt-2 text-center text-sm font-semibold text-white group-hover:text-accent">{item.label}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
