"use client";

import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import type { Product } from "@/types";
import type { CollectionId } from "@/lib/products";
import { getProductCollection, collectionOrder, sortByCollection } from "@/lib/products";
import { getUi, type Locale } from "@/lib/locale";
import { ProductGrid } from "./ProductGrid";

interface ShopCatalogProps {
  products: Product[];
  locale?: Locale;
}

type SortKey = "featured" | "priceAsc" | "priceDesc" | "name";

export function ShopCatalog({ products, locale = "es" }: ShopCatalogProps) {
  const ui = getUi(locale);
  const sp = ui.shopPage;
  const searchParams = useSearchParams();
  const [active, setActive] = useState<CollectionId | "all">("all");
  const [sort, setSort] = useState<SortKey>("featured");

  useEffect(() => {
    const tipo = searchParams.get("tipo") as CollectionId | null;
    if (tipo && collectionOrder.includes(tipo)) setActive(tipo);
    else setActive("all");
  }, [searchParams]);

  const availableCollections = useMemo(() => {
    const present = new Set(products.map((p) => getProductCollection(p)));
    return collectionOrder.filter((c) => present.has(c));
  }, [products]);

  const filtered = useMemo(() => {
    let list = active === "all" ? products : products.filter((p) => getProductCollection(p) === active);
    switch (sort) {
      case "priceAsc":
        list = [...list].sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
        break;
      case "priceDesc":
        list = [...list].sort((a, b) => (b.price ?? -Infinity) - (a.price ?? -Infinity));
        break;
      case "name":
        list = [...list].sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        list = sortByCollection(list);
    }
    return list;
  }, [products, active, sort]);

  const chip = (id: CollectionId | "all", label: string) => (
    <button
      key={id}
      type="button"
      onClick={() => setActive(id)}
      className={`chip ${active === id ? "chip-active" : ""}`}
      aria-pressed={active === id}
    >
      {label}
    </button>
  );

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 lg:mx-0 lg:flex-wrap lg:px-0">
          {chip("all", sp.collections.all)}
          {availableCollections.map((c) => chip(c, sp.collections[c]))}
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <span className="hidden text-sm text-text-muted sm:inline">
            {sp.results.replace("{count}", String(filtered.length))}
          </span>
          <label className="flex items-center gap-2 rounded-full border border-line bg-white px-3 py-2 text-sm">
            <SlidersHorizontal className="h-4 w-4 text-text-muted" />
            <span className="sr-only">{sp.sortLabel}</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="bg-transparent font-semibold text-text outline-none"
            >
              <option value="featured">{sp.sortFeatured}</option>
              <option value="priceAsc">{sp.sortPriceAsc}</option>
              <option value="priceDesc">{sp.sortPriceDesc}</option>
              <option value="name">{sp.sortName}</option>
            </select>
          </label>
        </div>
      </div>

      {filtered.length > 0 ? (
        <ProductGrid products={filtered} locale={locale} />
      ) : (
        <div className="rounded-2xl border border-dashed border-line bg-surface py-16 text-center">
          <p className="text-text-muted">{sp.empty}</p>
          <button
            type="button"
            onClick={() => setActive("all")}
            className="mt-3 text-sm font-semibold text-accent hover:underline"
          >
            {sp.clearFilters}
          </button>
        </div>
      )}
    </div>
  );
}
