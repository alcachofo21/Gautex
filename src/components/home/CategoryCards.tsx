"use client";

import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { Shield, HeartPulse, Microscope, ChevronRight } from "lucide-react";
import { categories } from "@/lib/products";

const iconMap: Record<string, React.ElementType> = {
  shield: Shield,
  "heart-pulse": HeartPulse,
  microscope: Microscope,
};

export function CategoryCards() {
  const [emblaRef] = useEmblaCarousel({ align: "start", containScroll: "trimSnaps" });

  return (
    <section className="py-12 sm:py-16">
      <div className="container-page">
        <h2 className="text-fluid-title mb-8 font-display font-bold text-text">
          Explora nuestras categorías
        </h2>

        <div className="hidden gap-6 md:grid md:grid-cols-3">
          {categories.map((cat) => {
            const Icon = iconMap[cat.icon] || Shield;
            return (
              <Link
                key={cat.id}
                href={cat.href}
                className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                <div
                  className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl text-white"
                  style={{ backgroundColor: cat.color }}
                >
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="font-display text-xl font-bold group-hover:text-primary">
                  {cat.name}
                </h3>
                <p className="mt-2 text-sm text-text-muted">{cat.description}</p>
                <ChevronRight className="absolute bottom-8 right-8 h-5 w-5 text-primary opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
            );
          })}
        </div>

        <div className="overflow-hidden md:hidden" ref={emblaRef}>
          <div className="flex gap-4">
            {categories.map((cat) => {
              const Icon = iconMap[cat.icon] || Shield;
              return (
                <Link
                  key={cat.id}
                  href={cat.href}
                  className="min-w-[85%] flex-shrink-0 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
                >
                  <div
                    className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl text-white"
                    style={{ backgroundColor: cat.color }}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-display text-lg font-bold">{cat.name}</h3>
                  <p className="mt-1 text-sm text-text-muted line-clamp-2">{cat.description}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
