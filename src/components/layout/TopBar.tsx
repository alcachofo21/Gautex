"use client";

import { Phone, Truck, Clock } from "lucide-react";
import { usePathname } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { getCorporate, getLocaleFromPath, getUi } from "@/lib/locale";

export function TopBar() {
  const pathname = usePathname();
  const locale = getLocaleFromPath(pathname);
  const corporate = getCorporate(locale);
  const ui = getUi(locale);

  return (
    <div className="hidden border-b border-primary/10 bg-primary text-white sm:block">
      <div className="container-page flex items-center justify-between py-2 text-sm">
        <div className="flex items-center gap-6">
          <a href={`tel:${corporate.company.phone.replace(/-/g, "")}`} className="flex items-center gap-2 hover:underline">
            <Phone className="h-4 w-4" />
            {corporate.company.phone}
          </a>
          <span className="flex items-center gap-2 opacity-90">
            <Truck className="h-4 w-4" />
            {ui.topbar.shipping}
          </span>
          <span className="hidden items-center gap-2 opacity-90 md:flex">
            <Clock className="h-4 w-4" />
            {ui.topbar.responseTime}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Badge className="bg-white/20 text-white">CE 0120</Badge>
          <Badge className="bg-white/20 text-white">ISO 13485</Badge>
        </div>
      </div>
    </div>
  );
}
