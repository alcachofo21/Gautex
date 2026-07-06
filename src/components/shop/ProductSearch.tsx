"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, X } from "lucide-react";
import { shopProducts, localizeProduct } from "@/lib/products";
import { getLocaleFromPath, getUi, localizedPath, getCategories } from "@/lib/locale";

export function ProductSearch() {
  const pathname = usePathname();
  const locale = getLocaleFromPath(pathname);
  const ui = getUi(locale);
  const s = ui.search;
  const categories = getCategories(locale);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return shopProducts
      .filter((p) => {
        const localized = localizeProduct(p, locale);
        return (
          localized.name.toLowerCase().includes(q) ||
          localized.shortDescription.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
        );
      })
      .slice(0, 6);
  }, [query, locale]);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex h-11 w-11 items-center justify-center rounded-xl hover:bg-surface"
        aria-label={s.label}
        aria-expanded={open}
      >
        <Search className="h-5 w-5" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40 bg-black/30" onClick={() => setOpen(false)} aria-hidden />
          <div
            className="absolute right-0 top-full z-50 mt-2 w-[min(360px,90vw)] rounded-2xl border border-gray-200 bg-white p-4 shadow-2xl"
            role="dialog"
            aria-label={s.label}
          >
            <div className="flex items-center gap-2 rounded-xl border border-gray-200 px-3">
              <Search className="h-4 w-4 text-text-muted" />
              <input
                type="search"
                placeholder={s.placeholder}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="min-h-[44px] flex-1 bg-transparent text-sm outline-none"
                autoFocus
              />
              <button type="button" onClick={() => setOpen(false)} aria-label={s.close}>
                <X className="h-4 w-4" />
              </button>
            </div>
            {results.length > 0 && (
              <ul className="mt-3 max-h-64 overflow-y-auto">
                {results.map((p) => {
                  const localized = localizeProduct(p, locale);
                  const catName = categories.find((c) => c.id === p.category)?.name ?? p.category;
                  return (
                    <li key={p.id}>
                      <Link
                        href={localizedPath(`/productos/${p.category}/${p.slug}`, locale)}
                        onClick={() => setOpen(false)}
                        className="block rounded-lg px-3 py-2 text-sm hover:bg-surface"
                      >
                        <span className="font-semibold">{localized.name}</span>
                        <span className="ml-2 text-xs text-text-muted">{catName}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
            {query && results.length === 0 && (
              <p className="mt-3 px-3 text-sm text-text-muted">{s.noResults}</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
