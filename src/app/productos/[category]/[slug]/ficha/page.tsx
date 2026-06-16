import { notFound } from "next/navigation";
import { getProductBySlug, products, localizeProduct } from "@/lib/products";
import { DatasheetContent } from "@/components/product/DatasheetContent";
import { buildPageMetadata } from "@/lib/seo";

interface Props {
  params: Promise<{ category: string; slug: string }>;
}

export async function generateStaticParams() {
  return products.map((p) => ({ category: p.category, slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { category, slug } = await params;
  const product = getProductBySlug(category, slug);
  if (!product) return { title: "Ficha técnica" };
  return buildPageMetadata({
    title: `Ficha técnica — ${product.name}`,
    description: product.shortDescription,
    path: `/productos/${category}/${slug}/ficha`,
    locale: "es",
    noIndex: true,
  });
}

export default async function DatasheetPage({ params }: Props) {
  const { category, slug } = await params;
  const product = getProductBySlug(category, slug);
  if (!product) notFound();

  return <DatasheetContent product={product} locale="es" />;
}
