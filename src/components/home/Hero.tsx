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
    labels: ["Preservativos Matrix", "Preservativos Viva", "Max Gel", "Campañas"],
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
          quality={75}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/[0.96] via-primary/60 to-transparent" />
        <div className="absolute inset-y-0 left-0 w-full max-w-3xl bg-gradient-to-r from-black/30 to-transparent lg:max-w-[52%]" />
      </div>

      <div className="container-page relative py-10 sm:py-12 lg:py-11 xl:py-12">
        <div className="grid items-center gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 xl:gap-10">
          <div className="max-w-xl lg:max-w-none">
            <div className="mb-3 flex flex-wrap gap-1.5">
              <Badge className="bg-white/20 px-2.5 py-0.5 text-xs text-white backdrop-blur">CE 0120 SGS</Badge>
              <Badge className="bg-accent/90 px-2.5 py-0.5 text-xs text-white">ISO 13485</Badge>
              <Badge className="bg-white/20 px-2.5 py-0.5 text-xs text-white backdrop-blur">{t.since}</Badge>
            </div>

            <h1 className="text-fluid-hero font-display font-bold text-white">
              {t.title}{" "}
              <span className="text-accent">{t.accent}</span>
            </h1>

            <div className="mt-3 flex h-8 items-center gap-2 text-base text-white/80 sm:text-lg">
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

            <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/75 sm:text-base">{t.desc}</p>

            <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:gap-3">
              <Button href={localizedPath("/productos", locale)} size="md" fullWidth className="sm:w-auto">
                {t.shop}
              </Button>
              <Button
                href={localizedPath("/campanas", locale)}
                variant="outline"
                size="md"
                fullWidth
                className="border-white/40 bg-white/10 text-white hover:bg-white/20 sm:w-auto"
              >
                {t.campaign}
              </Button>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="ml-auto grid w-full max-w-[22rem] grid-cols-2 gap-3 xl:max-w-[24rem] xl:gap-3.5">
              {gridItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="group overflow-hidden rounded-2xl border border-white/25 bg-white/10 p-2.5 backdrop-blur-md transition hover:border-accent/60 hover:bg-white/15 hover:shadow-lg"
                >
                  <div className="relative aspect-[5/4] overflow-hidden rounded-xl bg-white/5">
                    <Image
                      src={item.src}
                      alt={item.label}
                      fill
                      className="object-cover transition duration-300 group-hover:scale-105"
                      sizes="180px"
                      quality={75}
                      loading="lazy"
                    />
                  </div>
                  <p className="mt-1.5 text-center text-xs font-semibold text-white group-hover:text-accent xl:text-sm">
                    {item.label}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
