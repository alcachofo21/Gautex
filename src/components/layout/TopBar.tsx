"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Truck, ShieldCheck, BadgeCheck, Headset } from "lucide-react";
import { getLocaleFromPath, getUi, localizedPath } from "@/lib/locale";

export function TopBar() {
  const pathname = usePathname();
  const locale = getLocaleFromPath(pathname);
  const ui = getUi(locale);

  const messages =
    locale === "en"
      ? [
          { icon: Truck, text: "Free shipping across Europe on wholesale orders" },
          { icon: ShieldCheck, text: "CE 0120 SGS · ISO 13485 certified medical products" },
          { icon: BadgeCheck, text: "Discreet packaging · Secure Stripe checkout" },
        ]
      : [
          { icon: Truck, text: "Envío a toda Europa · gratis en pedidos por caja" },
          { icon: ShieldCheck, text: "Productos sanitarios certificados CE 0120 SGS · ISO 13485" },
          { icon: BadgeCheck, text: "Embalaje discreto · Pago seguro con Stripe" },
        ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setIndex((i) => (i + 1) % messages.length), 4000);
    return () => clearInterval(timer);
  }, [messages.length]);

  const Current = messages[index].icon;

  return (
    <div className="bg-primary text-white">
      <div className="container-page flex h-9 items-center justify-between gap-4 text-xs sm:text-[13px]">
        <div className="flex min-w-0 items-center gap-2">
          <Current className="h-3.5 w-3.5 shrink-0 text-accent" />
          <span key={index} className="truncate font-medium text-white/90">
            {messages[index].text}
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-4">
          <Link
            href={localizedPath("/distribuidores", locale)}
            className="hidden items-center gap-1.5 font-semibold text-white/90 hover:text-white sm:flex"
          >
            <Headset className="h-3.5 w-3.5" />
            {ui.topbar.distributors}
          </Link>
          <Link
            href={localizedPath("/calidad", locale)}
            className="hidden font-medium text-white/80 hover:text-white md:inline"
          >
            {ui.nav.quality}
          </Link>
        </div>
      </div>
    </div>
  );
}
