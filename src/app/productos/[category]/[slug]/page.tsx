import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Truck, ShieldCheck, Lock, PackageCheck } from "lucide-react";
import { getProductBySlug, getRelatedProducts, products, getCategoryById } from "@/lib/products";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { StickyAddToCart } from "@/components/shop/StickyAddToCart";
import { ProductActions } from "./ProductActions";
import { Badge } from "@/components/ui/Badge";
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
  const categoryName = getCategoryById(category)?.name ?? category;
  const hasPrice = product.price !== null && product.price !== undefined;

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    brand: { "@type": "Brand", name: "Gautex Medica" },
    category: product.category,
  };

  const trust = [
    { icon: ShieldCheck, text: "Certificado CE · ISO 13485" },
    { icon: Truck, text: "Envío a toda Europa" },
    { icon: Lock, text: "Pago seguro con Stripe" },
    { icon: PackageCheck, text: "Embalaje discreto" },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <div className="pb-24 lg:pb-12">
        <div className="container-page py-8 sm:py-12">
          <nav className="mb-6 flex flex-wrap items-center gap-1 text-sm text-text-muted">
            <Link href="/productos" className="hover:text-primary">
              Tienda
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href={`/productos/${category}`} className="hover:text-primary">
              {categoryName}
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-text">{product.name}</span>
          </nav>

          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            <div className="lg:sticky lg:top-40 lg:self-start">
              <ProductImage
                src={product.image}
                alt={product.name}
                color={product.color}
                className="aspect-square w-full rounded-3xl border border-line"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>

            <div>
              <Badge variant="outline" className="mb-3">
                {categoryName}
              </Badge>
              <h1 className="font-display text-3xl font-extrabold sm:text-4xl">{product.name}</h1>

              <div className="mt-4 flex items-baseline gap-3">
                {hasPrice ? (
                  <span className="price text-4xl">{product.priceLabel}</span>
                ) : (
                  <span className="text-2xl font-bold text-primary">{product.priceLabel}</span>
                )}
                {hasPrice && <span className="text-sm text-text-muted">IVA no incluido</span>}
              </div>

              <p className="mt-4 leading-relaxed text-text-muted">{product.description}</p>

              <ProductActions product={product} />

              <p className="mt-4">
                <Link
                  href={`/productos/${category}/${slug}/ficha`}
                  className="text-sm font-semibold text-primary hover:underline"
                >
                  Descargar / imprimir ficha técnica →
                </Link>
              </p>

              <div className="mt-6 grid grid-cols-2 gap-3 rounded-2xl border border-line bg-surface p-4">
                {trust.map((item) => (
                  <div key={item.text} className="flex items-center gap-2 text-sm text-text">
                    <item.icon className="h-5 w-5 shrink-0 text-accent" />
                    {item.text}
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <h2 className="mb-4 font-display text-lg font-bold">Especificaciones</h2>
                <table className="w-full text-sm">
                  <tbody>
                    {Object.entries(product.specs).map(([key, value]) => (
                      <tr key={key} className="border-b border-line/70">
                        <td className="py-3 font-medium text-text-muted">{key}</td>
                        <td className="py-3 text-right font-semibold">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6">
                <h2 className="mb-3 font-display text-lg font-bold">Certificaciones</h2>
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
