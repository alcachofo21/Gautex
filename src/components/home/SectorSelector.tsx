import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getSectors, getUi, sectorPath, type Locale } from "@/lib/locale";

interface SectorSelectorProps {
  locale?: Locale;
}

export function SectorSelector({ locale = "es" }: SectorSelectorProps) {
  const sectors = getSectors(locale);
  const ui = getUi(locale).home.sectors;

  return (
    <section className="bg-white py-12 sm:py-16">
      <div className="container-page">
        <div className="mb-8 text-center">
          <h2 className="text-fluid-title font-display font-bold">{ui.title}</h2>
          <p className="mx-auto mt-2 max-w-2xl text-text-muted">{ui.subtitle}</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {sectors.map((sector) => (
            <Link
              key={sector.id}
              href={sectorPath(sector.id, locale)}
              className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl"
            >
              <div className="relative h-40 w-full">
                <Image
                  src={sector.image}
                  alt={sector.title}
                  fill
                  className="object-cover transition duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  quality={75}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent" />
                <h3 className="absolute bottom-4 left-4 right-4 font-display text-lg font-bold text-white">
                  {sector.title}
                </h3>
              </div>
              <div className="flex items-center justify-between p-4">
                <p className="text-sm text-text-muted line-clamp-2">{sector.headline}</p>
                <ChevronRight className="h-5 w-5 shrink-0 text-primary opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
