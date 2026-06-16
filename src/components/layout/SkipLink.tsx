"use client";

import { usePathname } from "next/navigation";
import { getUi, getLocaleFromPath } from "@/lib/locale";

export function SkipLink() {
  const pathname = usePathname();
  const ui = getUi(getLocaleFromPath(pathname));

  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-xl focus:bg-primary focus:px-4 focus:py-3 focus:text-white focus:shadow-lg"
    >
      {ui.a11y.skipToContent}
    </a>
  );
}
