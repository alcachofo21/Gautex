import { notFound } from "next/navigation";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { getProductsByCategory, localizeProducts } from "@/lib/products";
import { getCategories } from "@/lib/locale";

interface Props {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  return getCategories("en").map((c) => ({ category: c.id }));
}

export async function generateMetadata({ params }: Props) {
  const { category } = await params;
  const cat = getCategories("en").find((c) => c.id === category);
  if (!cat) return { title: "Products" };
  return { title: cat.name, description: cat.description };
}

export default async function EnCategoryPage({ params }: Props) {
  const { category } = await params;
  const cat = getCategories("en").find((c) => c.id === category);
  if (!cat) notFound();

  const products = localizeProducts(getProductsByCategory(category), "en");

  return (
    <div className="py-12 sm:py-16">
      <div className="container-page">
        <h1 className="text-fluid-title font-display font-bold">{cat.name}</h1>
        <p className="mt-4 max-w-2xl text-text-muted">{cat.description}</p>
        <div className="mt-12">
          <ProductGrid products={products} locale="en" />
        </div>
      </div>
    </div>
  );
}
