"use client";

import useEmblaCarousel from "embla-carousel-react";
import { Star, CheckCircle } from "lucide-react";
import { testimonials } from "@/lib/products";
import { getUi, type Locale } from "@/lib/locale";

interface TestimonialsProps {
  locale?: Locale;
}

export function Testimonials({ locale = "es" }: TestimonialsProps) {
  const ui = getUi(locale);
  const [emblaRef] = useEmblaCarousel({ align: "start", loop: true });

  return (
    <section className="bg-white py-12 sm:py-16">
      <div className="container-page">
        <div className="mb-8 text-center">
          <h2 className="text-fluid-title font-display font-bold">
            {ui.home.testimonialsTitle}
          </h2>
          <p className="mt-2 text-text-muted">
            {ui.home.testimonialsSubtitle}
          </p>
          <p className="mt-1 text-xs text-text-muted/80">{ui.home.testimonialsNote}</p>
        </div>

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-4">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="min-w-[85%] flex-shrink-0 rounded-2xl border border-gray-200 bg-surface p-6 sm:min-w-[45%] lg:min-w-[30%]"
              >
                <div className="mb-3 flex gap-1">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-text">&ldquo;{t.text}&rdquo;</p>
                <div className="mt-4 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-text-muted">{t.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
