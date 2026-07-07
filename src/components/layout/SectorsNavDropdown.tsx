"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { getSectors, getUi, sectorPath, type Locale } from "@/lib/locale";

interface SectorsNavDropdownProps {
  locale: Locale;
}

export function SectorsNavDropdown({ locale }: SectorsNavDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const sectors = getSectors(locale);
  const label = getUi(locale).nav.sectors;

  const isActive = sectors.some((s) => pathname === sectorPath(s.id, locale));

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1 text-sm font-medium transition-colors ${
          isActive ? "text-primary" : "text-text-muted hover:text-primary"
        }`}
        aria-expanded={open}
        aria-haspopup="true"
      >
        {label}
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute left-0 top-full z-50 mt-2 min-w-[220px] rounded-xl border border-gray-200 bg-white py-2 shadow-xl">
          {sectors.map((sector) => (
            <Link
              key={sector.id}
              href={sectorPath(sector.id, locale)}
              onClick={() => setOpen(false)}
              className="block px-4 py-2.5 text-sm text-text hover:bg-surface hover:text-primary"
            >
              {sector.title}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
