"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe } from "lucide-react";
import { switchLocalePath, getLocaleFromPath, getUi } from "@/lib/locale";

export function LanguageSwitcher() {
  const pathname = usePathname();
  const locale = getLocaleFromPath(pathname);
  const ui = getUi(locale);
  const target = switchLocalePath(pathname);

  return (
    <Link
      href={target}
      className="flex h-11 items-center gap-1.5 rounded-xl px-2.5 text-sm font-semibold text-text-muted hover:bg-surface hover:text-primary sm:px-3"
      aria-label={`Switch to ${ui.lang.switch}`}
    >
      <Globe className="h-4 w-4 shrink-0" />
      <span className="hidden md:inline">{ui.lang.switch}</span>
      <span className="rounded-md bg-surface px-1.5 py-0.5 text-xs font-bold">{ui.lang.current}</span>
    </Link>
  );
}
