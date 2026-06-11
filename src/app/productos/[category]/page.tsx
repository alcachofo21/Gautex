import { notFound } from "next/navigation";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { getCategoryById, getProductsByCategory, categories } from "@/lib/products";

interface Props {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  return categories.map((c) => ({ category: c.id }));
}

export async function generateMetadata({ params }: Props) {
  const { category } = await params;
  const cat = getCategoryById(category);
  if (!cat) return { title: "Productos" };
  return {
    title: cat.name,
    description: cat.description,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const cat = getCategoryById(category);
  if (!cat) notFound();

  const products = getProductsByCategory(category);

  return (
    <div className="py-12 sm:py-16">
      <div className="container-page">
        <h1 className="text-fluid-title font-display font-bold">{cat.name}</h1>
        <p className="mt-4 max-w-2xl text-text-muted">{cat.description}</p>
        <div className="mt-12">
          <ProductGrid products={products} />
        </div>
      </div>
    </div>
  );
}
