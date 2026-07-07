import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getUi, localizedPath, type Locale } from "@/lib/locale";

const brandImages = [
  "/images/products/matrix-condoms.webp",
  "/images/products/viva-condoms.webp",
  "/images/products/max-gel.webp",
  "/images/products/gecofun.webp",
];

const brandSlugs = [
  "/productos/preventivo/matrix-condoms",
  "/productos/preventivo/viva-condoms",
  "/productos/preventivo/max-gel",
  "/productos/ginecologia/gecofun",
];

interface BrandFamiliesProps {
  locale?: Locale;
}

export function BrandFamilies({ locale = "es" }: BrandFamiliesProps) {
  const ui = getUi(locale).home.brands;

  return (
    <section className="bg-surface py-12 sm:py-16">
      <div className="container-page">
        <h2 className="text-fluid-title mb-8 text-center font-display font-bold">{ui.title}</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ui.items.map((brand, i) => (
            <Link
              key={brand.name}
              href={localizedPath(brandSlugs[i], locale)}
              className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg"
            >
              <div className="relative aspect-[4/3] bg-[#fafafa]">
                <Image
                  src={brandImages[i]}
                  alt={brand.name}
                  fill
                  className="object-contain p-4 transition duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, 25vw"
                  quality={75}
                  loading="lazy"
                />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-display font-bold text-primary group-hover:text-accent">{brand.name}</h3>
                  <ChevronRight className="h-4 w-4 shrink-0 text-primary opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
                <p className="mt-1 text-sm text-text-muted">{brand.claim}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
