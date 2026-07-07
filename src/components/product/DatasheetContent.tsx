"use client";

import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ProductImage } from "@/components/shop/ProductImage";
import { getUi, localizedPath, type Locale } from "@/lib/locale";
import type { Product } from "@/types";

interface DatasheetContentProps {
  product: Product;
  locale?: Locale;
}

export function DatasheetContent({ product, locale = "es" }: DatasheetContentProps) {
  const ui = getUi(locale).datasheet;

  return (
    <div className="py-12 print:py-4">
      <div className="container-page max-w-3xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 print:hidden">
          <Button href={localizedPath(`/productos/${product.category}/${product.slug}`, locale)} variant="outline">
            ← {ui.back}
          </Button>
          <Button onClick={() => window.print()}>{ui.print}</Button>
        </div>

        <header className="border-b border-gray-200 pb-6">
          <p className="text-sm font-semibold text-primary">Gautex Medica</p>
          <h1 className="mt-2 font-display text-3xl font-bold">{product.name}</h1>
          <p className="mt-2 text-text-muted">{product.shortDescription}</p>
        </header>

        <div className="mt-8 grid gap-8 sm:grid-cols-2">
          <ProductImage
            src={product.image}
            alt={product.name}
            color={product.color}
            className="aspect-square rounded-xl"
          />
          <div>
            <h2 className="font-display text-lg font-bold">
              {ui.specs}
              {product.datasheetVariants?.length ? ` — ${product.name}` : ""}
            </h2>
            <table className="mt-4 w-full text-sm">
              <tbody>
                {Object.entries(product.specs).map(([key, value]) => (
                  <tr key={key} className="border-b border-gray-100">
                    <td className="py-2 font-medium text-text-muted">{key}</td>
                    <td className="py-2 text-right font-semibold">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {product.datasheetVariants?.map((variant) => (
          <section key={variant.name} className="mt-8">
            <h2 className="font-display text-lg font-bold">{variant.name}</h2>
            <table className="mt-4 w-full text-sm">
              <tbody>
                {Object.entries(variant.specs).map(([key, value]) => (
                  <tr key={key} className="border-b border-gray-100">
                    <td className="py-2 font-medium text-text-muted">{key}</td>
                    <td className="py-2 text-right font-semibold">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        ))}

        <section className="mt-8">
          <h2 className="font-display text-lg font-bold">{ui.certifications}</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {product.certifications.map((cert) => (
              <Badge key={cert} variant="outline">{cert}</Badge>
            ))}
          </div>
        </section>

        <section className="mt-8 text-sm text-text-muted">
          <p>{product.description}</p>
          <p className="mt-4 font-semibold text-text">{product.priceLabel}</p>
        </section>
      </div>
    </div>
  );
}
