import { notFound } from "next/navigation";
import Link from "next/link";
import { getProductBySlug, getRelatedProducts, products } from "@/lib/products";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { StickyAddToCart } from "@/components/shop/StickyAddToCart";
import { ProductActions } from "./ProductActions";
import { Badge } from "@/components/ui/Badge";
import { AccordionItem } from "@/components/ui/Accordion";
import { ProductImage } from "@/components/shop/ProductImage";

interface Props {
  params: Promise<{ category: string; slug: string }>;
}

export async function generateStaticParams() {
  return products.map((p) => ({ category: p.category, slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { category, slug } = await params;
  const product = getProductBySlug(category, slug);
  if (!product) return { title: "Producto" };
  return {
    title: product.name,
    description: product.shortDescription,
  };
}

export default async function ProductPage({ params }: Props) {
  const { category, slug } = await params;
  const product = getProductBySlug(category, slug);
  if (!product) notFound();

  const related = getRelatedProducts(product);

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    brand: { "@type": "Brand", name: "Gautex Medica" },
    category: product.category,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <div className="pb-24 lg:pb-12">
        <div className="container-page py-12">
          <nav className="mb-6 text-sm text-text-muted">
            <Link href="/productos" className="hover:text-primary">Productos</Link>
            {" / "}
            <Link href={`/productos/${category}`} className="hover:text-primary capitalize">{category}</Link>
            {" / "}
            <span className="text-text">{product.name}</span>
          </nav>

          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            <ProductImage
              src={product.image}
              alt={product.name}
              color={product.color}
              className="aspect-square w-full rounded-2xl"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />

            <div>
              <Badge className="mb-3">{product.category}</Badge>
              <h1 className="font-display text-3xl font-bold sm:text-4xl">{product.name}</h1>
              <p className="mt-2 text-2xl font-bold text-primary">{product.priceLabel}</p>
              <p className="mt-4 text-text-muted">{product.description}</p>

              <ProductActions product={product} />

              <p className="mt-4">
                <Link
                  href={`/productos/${category}/${slug}/ficha`}
                  className="text-sm font-semibold text-primary hover:underline"
                >
                  Descargar / imprimir ficha técnica →
                </Link>
              </p>

              <div className="mt-8 hidden lg:block">
                <h2 className="mb-4 font-display text-lg font-bold">Especificaciones</h2>
                <table className="w-full text-sm">
                  <tbody>
                    {Object.entries(product.specs).map(([key, value]) => (
                      <tr key={key} className="border-b border-gray-100">
                        <td className="py-3 font-medium text-text-muted">{key}</td>
                        <td className="py-3 text-right font-semibold">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 lg:hidden">
                <AccordionItem title="Especificaciones técnicas" defaultOpen>
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
                <h2 className="mb-3 font-display text-lg font-bold">Certificaciones</h2>
                <div className="flex flex-wrap gap-2">
                  {product.certifications.map((cert) => (
                    <Badge key={cert} variant="outline">{cert}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {related.length > 0 && (
            <section className="mt-16">
              <h2 className="mb-8 font-display text-2xl font-bold">Productos relacionados</h2>
              <ProductGrid products={related} />
            </section>
          )}
        </div>
      </div>
      <StickyAddToCart product={product} />
    </>
  );
}
