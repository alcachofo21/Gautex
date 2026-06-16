import type { Product } from "@/types";
import type { Locale } from "@/lib/locale";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  locale?: Locale;
}

export function ProductGrid({ products, locale = "es" }: ProductGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} locale={locale} priority={index < 4} />
      ))}
    </div>
  );
}
