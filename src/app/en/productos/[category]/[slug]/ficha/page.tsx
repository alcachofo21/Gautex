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
  if (!product) return { title: "Datasheet" };
  const localized = localizeProduct(product, "en");
  return buildPageMetadata({
    title: `Datasheet — ${localized.name}`,
    description: localized.shortDescription,
    path: `/productos/${category}/${slug}/ficha`,
    locale: "en",
    noIndex: true,
  });
}

export default async function EnDatasheetPage({ params }: Props) {
  const { category, slug } = await params;
  const product = getProductBySlug(category, slug);
  if (!product) notFound();

  return <DatasheetContent product={localizeProduct(product, "en")} locale="en" />;
}
