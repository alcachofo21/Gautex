import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts, products, localizeProduct, localizeProducts } from "@/lib/products";
import { ProductDetailContent } from "@/components/shop/ProductDetailContent";

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
      <ProductDetailContent
        product={product}
        category={category}
        slug={slug}
        related={related}
        locale="en"
      />
    </>
  );
}
