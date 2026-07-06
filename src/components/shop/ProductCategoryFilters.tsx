"use client";

import { usePathname, useRouter } from "next/navigation";
import type { Category } from "@/types";

interface ProductCategoryFiltersProps {
  categories: Category[];
  active: string;
  labels: {
    filterAll: string;
    categoryFilters: Record<string, string>;
  };
}

export function ProductCategoryFilters({ categories, active, labels }: ProductCategoryFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();

  const setFilter = (categoryId: string) => {
    const next = categoryId === "all" ? pathname : `${pathname}?c=${categoryId}`;
    router.replace(next, { scroll: false });
  };

  return (
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
