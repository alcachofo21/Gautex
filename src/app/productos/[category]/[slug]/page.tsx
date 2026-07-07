import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts, shopProducts } from "@/lib/products";
import { ProductDetailContent } from "@/components/shop/ProductDetailContent";

interface Props {
  params: Promise<{ category: string; slug: string }>;
}

export async function generateStaticParams() {
  return shopProducts.map((p) => ({ category: p.category, slug: p.slug }));
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
      <ProductDetailContent
        product={product}
        category={category}
        slug={slug}
        related={related}
        locale="es"
      />
    </>
  );
}
