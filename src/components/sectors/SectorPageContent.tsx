import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { getSector, getUi, localizedPath, type Locale } from "@/lib/locale";
import { products, localizeProduct } from "@/lib/products";

interface SectorPageContentProps {
  sectorId: string;
  locale?: Locale;
}

export function SectorPageContent({ sectorId, locale = "es" }: SectorPageContentProps) {
  const sector = getSector(sectorId, locale);
  if (!sector) notFound();

  const ui = getUi(locale).sectors;

  const sectorProducts = sector.products
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .map((p) => localizeProduct(p, locale));

  return (
    <div className="py-12 sm:py-16">
      <div className="container-page">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase text-primary">{sector.title}</p>
            <h1 className="text-fluid-title mt-2 font-display font-bold">{sector.headline}</h1>
            <p className="mt-4 text-text-muted">{sector.description}</p>
            <ul className="mt-6 space-y-2">
              {sector.benefits.map((b) => (
                <li key={b} className="flex gap-2 text-sm text-text">
                  <span className="text-primary">✓</span> {b}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href={localizedPath("/contacto", locale)}>{ui.cta}</Button>
              <Button href={localizedPath("/productos", locale)} variant="outline">
                {ui.ctaShop}
              </Button>
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <Image src={sector.image} alt={sector.title} fill className="object-cover" sizes="50vw" quality={80} loading="lazy" />
          </div>
        </div>

        {sectorProducts.length > 0 && (
          <section className="mt-16">
            <h2 className="mb-6 font-display text-2xl font-bold">
              {locale === "en" ? "Recommended products" : "Productos recomendados"}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {sectorProducts.map((p) => (
                <Link
                  key={p.id}
                  href={localizedPath(`/productos/${p.category}/${p.slug}`, locale)}
                  className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:border-primary"
                >
                  <p className="font-semibold">{p.name}</p>
                  <p className="mt-1 text-sm text-primary">{p.priceLabel}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
