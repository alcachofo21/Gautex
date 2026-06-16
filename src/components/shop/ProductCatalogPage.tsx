import { Suspense } from "react";
import { ProductCatalog } from "@/components/shop/ProductCatalog";
import { getCategories, getUi, type Locale } from "@/lib/locale";
import { localizeProducts, products } from "@/lib/products";

interface ProductCatalogPageProps {
  locale: Locale;
}

export function ProductCatalogPage({ locale }: ProductCatalogPageProps) {
  const ui = getUi(locale);
  const shop = ui.shopPage;
  const categoryList = getCategories(locale);
  const allProducts = localizeProducts(products, locale);

  return (
    <div className="py-12 sm:py-16">
      <div className="container-page">
        <h1 className="text-fluid-title font-display font-bold">{shop.title}</h1>
        <p className="mt-4 max-w-2xl text-text-muted">{shop.subtitle}</p>

        <Suspense
          fallback={
            <div className="mt-12 animate-pulse rounded-2xl bg-gray-100 h-64" aria-hidden />
          }
        >
          <ProductCatalog
            products={allProducts}
            categories={categoryList}
            locale={locale}
            labels={{
              filterAll: shop.filterAll,
              results: shop.results,
              categoryFilters: shop.categoryFilters,
            }}
          />
        </Suspense>
      </div>
    </div>
  );
}
