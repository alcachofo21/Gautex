"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Search, X } from "lucide-react";
import { products, localizeProduct } from "@/lib/products";
import { getLocaleFromPath, getUi, localizedPath, getCategories } from "@/lib/locale";

interface ProductSearchProps {
  variant?: "icon" | "bar";
}

export function ProductSearch({ variant = "bar" }: ProductSearchProps) {
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
    return products
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

  const ResultsList = (
    <>
      {results.length > 0 && (
        <ul className="mt-3 max-h-72 overflow-y-auto">
          {results.map((p) => {
            const localized = localizeProduct(p, locale);
            const catName = categories.find((c) => c.id === p.category)?.name ?? p.category;
            return (
              <li key={p.id}>
                <Link
                  href={localizedPath(`/productos/${p.category}/${p.slug}`, locale)}
                  onClick={() => {
                    setOpen(false);
                    setQuery("");
                  }}
                  className="flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-surface"
                >
                  <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-surface">
                    {p.image && (
                      <Image src={p.image} alt="" fill className="object-contain p-1" sizes="44px" />
                    )}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-text">{localized.name}</span>
                    <span className="block truncate text-xs text-text-muted">{catName}</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
      {query && results.length === 0 && <p className="mt-3 px-2 text-sm text-text-muted">{s.noResults}</p>}
    </>
  );

  if (variant === "bar") {
    return (
      <div className="relative w-full">
        <div className="flex items-center gap-2 rounded-full border border-line bg-surface px-4 focus-within:border-primary/40 focus-within:bg-white">
          <Search className="h-4 w-4 shrink-0 text-text-muted" />
          <input
            type="search"
            placeholder={s.placeholder}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            className="min-h-[44px] w-full bg-transparent text-sm outline-none"
            aria-label={s.label}
          />
          {query && (
            <button type="button" onClick={() => setQuery("")} aria-label={s.close}>
              <X className="h-4 w-4 text-text-muted" />
            </button>
          )}
        </div>
        {open && query && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} aria-hidden />
            <div className="absolute left-0 right-0 top-full z-50 mt-2 rounded-2xl border border-line bg-white p-3 shadow-2xl">
              {ResultsList}
            </div>
          </>
        )}
      </div>
    );
  }

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
            className="absolute right-0 top-full z-50 mt-2 w-[min(360px,90vw)] rounded-2xl border border-line bg-white p-4 shadow-2xl"
            role="dialog"
            aria-label={s.label}
          >
            <div className="flex items-center gap-2 rounded-xl border border-line px-3">
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
            {ResultsList}
          </div>
        </>
      )}
    </div>
  );
}
