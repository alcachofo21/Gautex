"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

const rotatingWords = ["Calidad", "Confianza", "Profesionalidad", "Innovación"];

export function Hero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % rotatingWords.length);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-white to-accent/5 py-12 sm:py-20 lg:py-28">
      <div className="container-page">
        <div className="mx-auto max-w-4xl text-center lg:text-left">
          <div className="mb-4 flex flex-wrap justify-center gap-2 lg:justify-start">
            <Badge>CE 0120 SGS</Badge>
            <Badge variant="accent">ISO 13485</Badge>
            <Badge>Desde 2002</Badge>
          </div>

          <h1 className="text-fluid-hero font-display font-bold leading-tight text-text">
            Repartiendo salud con productos{" "}
            <span className="text-primary">certificados CE</span>
          </h1>

          <div className="mt-4 flex h-10 items-center justify-center gap-2 text-lg text-text-muted lg:justify-start sm:text-xl">
            <span>Con</span>
            <AnimatePresence mode="wait">
              <motion.span
                key={rotatingWords[index]}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="font-display font-bold text-accent"
              >
                {rotatingWords[index]}
              </motion.span>
            </AnimatePresence>
          </div>

          <p className="mx-auto mt-6 max-w-2xl text-base text-text-muted sm:text-lg lg:mx-0">
            Distribución, comercialización y fabricación de productos sanitarios para farmacia y sector hospitalario en toda Europa.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <Button href="/productos" size="lg" fullWidth className="sm:w-auto">
              Ver tienda
            </Button>
            <Button href="/campanas" variant="outline" size="lg" fullWidth className="sm:w-auto">
              Personalizar campaña
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
