import { ProductCategoryFilters } from "@/components/shop/ProductCategoryFilters";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { getCategories, getUi, type Locale } from "@/lib/locale";
import { localizeProducts, shopProducts } from "@/lib/products";

interface ProductCatalogPageProps {
  locale: Locale;
  categoryFilter?: string | null;
}

export function ProductCatalogPage({ locale, categoryFilter }: ProductCatalogPageProps) {
  const ui = getUi(locale);
  const shop = ui.shopPage;
  const categoryList = getCategories(locale);
  const allProducts = localizeProducts(shopProducts, locale);

  const categoryValid =
    categoryFilter && categoryList.some((c) => c.id === categoryFilter) ? categoryFilter : null;
  let active = categoryValid ?? "all";
  let filtered =
    active === "all" ? allProducts : allProducts.filter((p) => p.category === active);

  if (filtered.length === 0 && allProducts.length > 0) {
    active = "all";
    filtered = allProducts;
  }

  const resultsLabel = shop.results.replace("{count}", String(filtered.length));

  return (
    <div className="py-12 sm:py-16">
      <div className="container-page">
        <h1 className="text-fluid-title font-display font-bold">{shop.title}</h1>
        <p className="mt-4 max-w-2xl text-text-muted">{shop.subtitle}</p>

        <ProductCategoryFilters
          categories={categoryList}
          active={active}
          labels={{
            filterAll: shop.filterAll,
            categoryFilters: shop.categoryFilters,
          }}
        />

        <p className="mt-4 text-sm text-text-muted">{resultsLabel}</p>

        <div className="mt-8">
          <ProductGrid products={filtered} locale={locale} />
        </div>
      </div>
    </div>
  );
}
