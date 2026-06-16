"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./Button";
import { getLocaleFromPath, getUi, localizedPath } from "@/lib/locale";

export function CookieBanner() {
  const pathname = usePathname();
  const locale = getLocaleFromPath(pathname);
  const ui = getUi(locale);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("gautex-cookie-consent");
    if (!consent) setVisible(true);
  }, []);

  const setConsent = (value: "accepted" | "rejected") => {
    localStorage.setItem("gautex-cookie-consent", value);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white p-4 shadow-2xl sm:p-6"
      role="dialog"
      aria-label="Cookies"
      style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
    >
      <div className="container-page flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-text-muted">
          {ui.cookies.message}{" "}
          <Link href={localizedPath("/legal/cookies", locale)} className="text-primary underline">
            {ui.cookies.more}
          </Link>
        </p>
        <div className="flex gap-3">
          <Button size="sm" variant="outline" onClick={() => setConsent("rejected")}>
            {ui.cookies.reject}
          </Button>
          <Button size="sm" onClick={() => setConsent("accepted")}>
            {ui.cookies.accept}
          </Button>
        </div>
      </div>
    </div>
  );
}
