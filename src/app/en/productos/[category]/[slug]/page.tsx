import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Truck, ShieldCheck, Lock, PackageCheck } from "lucide-react";
import { getProductBySlug, getRelatedProducts, products, localizeProduct, localizeProducts } from "@/lib/products";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { StickyAddToCart } from "@/components/shop/StickyAddToCart";
import { ProductActions } from "@/app/productos/[category]/[slug]/ProductActions";
import { Badge } from "@/components/ui/Badge";
import { ProductImage } from "@/components/shop/ProductImage";
import { getCategories } from "@/lib/locale";

interface Props {
  params: Promise<{ category: string; slug: string }>;
}

export async function generateStaticParams() {
  return products.map((p) => ({ category: p.category, slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { category, slug } = await params;
  const product = getProductBySlug(category, slug);
  if (!product) return { title: "Product" };
  const localized = localizeProduct(product, "en");
  return { title: localized.name, description: localized.shortDescription };
}

export default async function EnProductPage({ params }: Props) {
  const { category, slug } = await params;
  const raw = getProductBySlug(category, slug);
  if (!raw) notFound();

  const product = localizeProduct(raw, "en");
  const related = localizeProducts(getRelatedProducts(raw), "en");
  const categoryName = getCategories("en").find((c) => c.id === category)?.name ?? category;
  const hasPrice = product.price !== null && product.price !== undefined;

  const trust = [
    { icon: ShieldCheck, text: "CE certified · ISO 13485" },
    { icon: Truck, text: "Shipping across Europe" },
    { icon: Lock, text: "Secure Stripe payment" },
    { icon: PackageCheck, text: "Discreet packaging" },
  ];

  return (
    <div className="pb-24 lg:pb-12">
      <div className="container-page py-8 sm:py-12">
        <nav className="mb-6 flex flex-wrap items-center gap-1 text-sm text-text-muted">
          <Link href="/en/productos" className="hover:text-primary">
            Shop
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link href={`/en/productos/${category}`} className="hover:text-primary">
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
              quality={85}
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
              {hasPrice && <span className="text-sm text-text-muted">VAT not included</span>}
            </div>

            <p className="mt-4 leading-relaxed text-text-muted">{product.description}</p>

            <ProductActions product={product} locale="en" />

            <p className="mt-4">
              <Link
                href={`/en/productos/${category}/${slug}/ficha`}
                className="text-sm font-semibold text-primary hover:underline"
              >
                Download / print datasheet →
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
              <h2 className="mb-4 font-display text-lg font-bold">Specifications</h2>
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
              <h2 className="mb-3 font-display text-lg font-bold">Certifications</h2>
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
            <h2 className="mb-8 font-display text-2xl font-bold">Related products</h2>
            <ProductGrid products={related} locale="en" />
          </section>
        )}
      </div>
      <StickyAddToCart product={product} locale="en" />
    </div>
  );
}
