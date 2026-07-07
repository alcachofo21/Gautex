import Link from "next/link";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { StickyAddToCart } from "@/components/shop/StickyAddToCart";
import { ProductImageLightbox } from "@/components/shop/ProductImageLightbox";
import { ProductPurchaseInfo } from "@/components/shop/ProductPurchaseInfo";
import { ProductActions } from "@/app/productos/[category]/[slug]/ProductActions";
import { Badge } from "@/components/ui/Badge";
import { AccordionItem } from "@/components/ui/Accordion";
import { getCategories, getUi, localizedPath, type Locale } from "@/lib/locale";
import type { Product } from "@/types";

interface ProductDetailContentProps {
  product: Product;
  category: string;
  slug: string;
  related: Product[];
  locale?: Locale;
}

export function ProductDetailContent({
  product,
  category,
  slug,
  related,
  locale = "es",
}: ProductDetailContentProps) {
  const ui = getUi(locale);
  const pp = ui.productPage;
  const categoryName =
    getCategories(locale).find((c) => c.id === product.category)?.name ?? product.category;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: pp.breadcrumbs.products, item: localizedPath("/productos", locale) },
      {
        "@type": "ListItem",
        position: 2,
        name: categoryName,
        item: localizedPath(`/productos/${category}`, locale),
      },
      { "@type": "ListItem", position: 3, name: product.name },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="pb-24 lg:pb-12">
        <div className="container-page py-12">
          <nav className="mb-6 text-sm text-text-muted" aria-label="Breadcrumb">
            <Link href={localizedPath("/productos", locale)} className="hover:text-primary">
              {pp.breadcrumbs.products}
            </Link>
            {" / "}
            <Link
              href={localizedPath(`/productos/${category}`, locale)}
              className="hover:text-primary"
            >
              {categoryName}
            </Link>
            {" / "}
            <span className="text-text">{product.name}</span>
          </nav>

          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            <ProductImageLightbox
              src={product.image}
              alt={product.name}
              color={product.color}
              className="aspect-square w-full rounded-2xl"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
              quality={85}
            />

            <div>
              <div className="mb-3 flex flex-wrap gap-2">
                <Badge>{categoryName}</Badge>
                {product.certifications.slice(0, 2).map((cert) => (
                  <Badge key={cert} variant="outline">
                    {cert}
                  </Badge>
                ))}
              </div>
              <h1 className="font-display text-3xl font-bold sm:text-4xl">{product.name}</h1>
              <p className="mt-2 text-2xl font-bold text-primary">{product.priceLabel}</p>
              <p className="mt-4 text-text-muted">{product.description}</p>

              <ProductActions product={product} locale={locale} />
              <ProductPurchaseInfo product={product} locale={locale} />

              <p className="mt-4">
                <Link
                  href={localizedPath(`/productos/${category}/${slug}/ficha`, locale)}
                  className="text-sm font-semibold text-primary hover:underline"
                >
                  {ui.datasheet.download} →
                </Link>
              </p>

              <div className="mt-8 hidden lg:block">
                <h2 className="mb-4 font-display text-lg font-bold">{ui.datasheet.specs}</h2>
                <table className="w-full text-sm">
                  <tbody>
                    {Object.entries(product.specs).map(([key, value], i) => (
                      <tr
                        key={key}
                        className={`border-b border-gray-100 ${i % 2 === 0 ? "bg-surface/50" : ""}`}
                      >
                        <td className="py-3 pl-3 font-medium text-text-muted">{key}</td>
                        <td className="py-3 pr-3 text-right font-semibold">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 lg:hidden">
                <AccordionItem title={ui.datasheet.specs} defaultOpen>
                  <dl className="space-y-3">
                    {Object.entries(product.specs).map(([key, value]) => (
                      <div key={key} className="flex justify-between rounded-lg bg-surface p-3">
                        <dt className="text-sm text-text-muted">{key}</dt>
                        <dd className="text-sm font-semibold">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </AccordionItem>
              </div>

              <div className="mt-6">
                <h2 className="mb-3 font-display text-lg font-bold">{ui.datasheet.certifications}</h2>
                <div className="flex flex-wrap gap-2">
                  {product.certifications.map((cert) => (
                    <Badge key={cert} variant="outline">
                      {cert}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {related.length > 0 && (
            <section className="mt-16">
              <h2 className="mb-8 font-display text-2xl font-bold">{pp.related}</h2>
              <ProductGrid products={related} locale={locale} />
            </section>
          )}
        </div>
      </div>
      <StickyAddToCart product={product} locale={locale} />
    </>
  );
}
