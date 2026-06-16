"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { getLocaleFromPath } from "@/lib/locale";

export function LocaleSync() {
  const pathname = usePathname();

  useEffect(() => {
    document.documentElement.lang = getLocaleFromPath(pathname);
  }, [pathname]);

  return null;
}
