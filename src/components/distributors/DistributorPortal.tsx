"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { getUi, localizedPath, type Locale } from "@/lib/locale";

interface DistributorPortalProps {
  locale?: Locale;
}

export function DistributorPortal({ locale = "es" }: DistributorPortalProps) {
  const ui = getUi(locale).distributors;
  const [code, setCode] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/distributor/auth")
      .then((r) => r.json())
      .then((d) => setAuthenticated(Boolean(d.authenticated)))
      .finally(() => setLoading(false));
  }, []);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);
    const res = await fetch("/api/distributor/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });
    if (res.ok) {
      setAuthenticated(true);
    } else {
      setError(true);
    }
  };

  const logout = async () => {
    await fetch("/api/distributor/auth", { method: "DELETE" });
    setAuthenticated(false);
    setCode("");
  };

  if (loading) {
    return <div className="container-page py-20 text-center text-text-muted">...</div>;
  }

  if (!authenticated) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h2 className="font-display text-xl font-bold">{ui.loginTitle}</h2>
        <p className="mt-2 text-sm text-text-muted">{ui.portalDesc}</p>
        <form onSubmit={login} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">{ui.codeLabel}</label>
            <input
              type="password"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full min-h-[48px] rounded-xl border border-gray-300 px-4 focus:border-primary focus:outline-none"
              required
            />
          </div>
          {error && <p className="text-sm text-red-500">{ui.invalidCode}</p>}
          <Button type="submit" fullWidth>{ui.login}</Button>
        </form>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-primary/20 bg-primary/5 p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="font-display text-xl font-bold text-primary">{ui.resourcesTitle}</h2>
        <Button variant="ghost" size="sm" onClick={logout}>{ui.logout}</Button>
      </div>
      <ul className="mt-6 space-y-3">
        <li>
          <Button href={localizedPath("/productos", locale)} variant="outline" size="sm">
            {ui.catalogPdf}
          </Button>
        </li>
        <li>
          <Button href={localizedPath("/contacto", locale)} variant="outline" size="sm">
            {ui.priceList}
          </Button>
        </li>
        <li>
          <Button href={localizedPath("/contacto", locale)} variant="secondary" size="sm">
            {ui.contactSales}
          </Button>
        </li>
      </ul>
    </div>
  );
}
