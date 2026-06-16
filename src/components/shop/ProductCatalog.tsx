"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ProductGrid } from "@/components/shop/ProductGrid";
import type { Locale } from "@/lib/locale";
import type { Category, Product } from "@/types";

interface ProductCatalogLabels {
  filterAll: string;
  results: string;
  categoryFilters: Record<string, string>;
}

interface ProductCatalogProps {
  products: Product[];
  categories: Category[];
  locale: Locale;
  labels: ProductCatalogLabels;
}

export function ProductCatalog({ products, categories, locale, labels }: ProductCatalogProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const paramCategory = searchParams.get("c");
  const validCategory = categories.some((c) => c.id === paramCategory) ? paramCategory : "all";
  const [active, setActive] = useState(validCategory || "all");

  useEffect(() => {
    setActive(validCategory || "all");
  }, [validCategory]);

  const filtered = useMemo(() => {
    if (active === "all") return products;
    return products.filter((p) => p.category === active);
  }, [active, products]);

  const setFilter = (categoryId: string) => {
    setActive(categoryId);
    const next = categoryId === "all" ? pathname : `${pathname}?c=${categoryId}`;
    router.replace(next, { scroll: false });
  };

  const resultsLabel = labels.results.replace("{count}", String(filtered.length));

  return (
    <>
      <div className="mt-8 flex flex-wrap gap-2" role="tablist" aria-label={labels.filterAll}>
        <FilterPill active={active === "all"} onClick={() => setFilter("all")}>
          {labels.filterAll}
        </FilterPill>
        {categories.map((cat) => (
          <FilterPill key={cat.id} active={active === cat.id} onClick={() => setFilter(cat.id)}>
            {labels.categoryFilters[cat.id] || cat.name}
          </FilterPill>
        ))}
      </div>

      <p className="mt-4 text-sm text-text-muted">{resultsLabel}</p>

      <div className="mt-8">
        <ProductGrid products={filtered} locale={locale} />
      </div>
    </>
  );
}

function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`min-h-[44px] rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
        active
          ? "bg-primary text-white shadow-sm"
          : "border border-gray-200 bg-white text-text-muted hover:border-primary/30 hover:text-primary"
      }`}
    >
      {children}
    </button>
  );
}
