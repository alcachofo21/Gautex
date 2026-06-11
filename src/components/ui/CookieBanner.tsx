"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "./Button";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("gautex-cookie-consent");
    if (!consent) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem("gautex-cookie-consent", "accepted");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white p-4 shadow-2xl sm:p-6" style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}>
      <div className="container-page flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-text-muted">
          Utilizamos cookies técnicas para mejorar su experiencia.{" "}
          <Link href="/legal/cookies" className="text-primary underline">
            Más información
          </Link>
        </p>
        <div className="flex gap-3">
          <Button size="sm" onClick={accept}>
            Aceptar
          </Button>
        </div>
      </div>
    </div>
  );
}
