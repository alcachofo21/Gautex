import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getCategoryById, getProductsByCategory, categories, sortByCollection } from "@/lib/products";
import { getUi } from "@/lib/locale";
import { ShopCatalog } from "@/components/shop/ShopCatalog";

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

  const ui = getUi("es");
  const products = sortByCollection(getProductsByCategory(category));

  return (
    <div className="pb-16">
      <section className="border-b border-line bg-surface">
        <div className="container-page py-8 sm:py-12">
          <nav className="mb-3 flex items-center gap-1 text-sm text-text-muted">
            <Link href="/productos" className="hover:text-primary">
              {ui.nav.shop}
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-text">{cat.name}</span>
          </nav>
          <h1 className="text-fluid-title font-display font-bold">{cat.name}</h1>
          <p className="mt-3 max-w-2xl text-text-muted">{cat.description}</p>
        </div>
      </section>

      <div className="container-page pt-8">
        <Suspense fallback={null}>
          <ShopCatalog products={products} locale="es" />
        </Suspense>
      </div>
    </div>
  );
}
