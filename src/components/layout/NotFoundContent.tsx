"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { getLocaleFromPath, getUi, localizedPath } from "@/lib/locale";

export function NotFoundContent() {
  const pathname = usePathname();
  const locale = getLocaleFromPath(pathname);
  const ui = getUi(locale);
  const n = ui.notFound;

  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="text-6xl font-display font-bold text-primary">404</p>
      <h1 className="mt-4 font-display text-3xl font-bold">{n.title}</h1>
      <p className="mt-4 max-w-md text-text-muted">{n.desc}</p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button href={localizedPath("/", locale)}>{n.home}</Button>
        <Button href={localizedPath("/productos", locale)} variant="outline">
          {n.shop}
        </Button>
      </div>
      <p className="mt-6 text-sm text-text-muted">
        <Link href={locale === "en" ? "/" : "/en"} className="text-primary hover:underline">
          {n.enLink}
        </Link>
      </p>
    </div>
  );
}
