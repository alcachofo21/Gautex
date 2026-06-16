"use client";

import { CreditCard } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { EnabledPaymentMethod } from "@/lib/payments/types";

interface InstantPaymentPanelProps {
  methods: EnabledPaymentMethod[];
  totalLabel: string;
  loading: boolean;
  onPay: () => void;
  labels: {
    title: string;
    subtitle: string;
    payNow: string;
    notPayable: string;
    pendingSetup: string;
    secure: string;
  };
  payable: boolean;
  checkoutReady: boolean;
}

export function InstantPaymentPanel({
  methods,
  totalLabel,
  loading,
  onPay,
  labels,
  payable,
  checkoutReady,
}: InstantPaymentPanelProps) {
  if (methods.length === 0) return null;

  const method = methods[0];

  return (
    <section className="mt-6 rounded-2xl border border-primary/20 bg-primary/5 p-6">
      <h2 className="font-display text-lg font-bold text-primary">{labels.title}</h2>
      <p className="mt-1 text-sm text-text-muted">{labels.subtitle}</p>

      {!payable ? (
        <p className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900">{labels.notPayable}</p>
      ) : (
        <>
          <p className="mt-4 text-2xl font-bold text-text">{totalLabel}</p>

          {checkoutReady ? (
            <Button fullWidth onClick={onPay} disabled={loading} className="mt-4">
              <CreditCard className="h-5 w-5" />
              {labels.payNow}
            </Button>
          ) : (
            <p className="mt-4 rounded-xl bg-blue-50 px-4 py-3 text-sm text-blue-900">{labels.pendingSetup}</p>
          )}

          <ul className="mt-5 flex flex-wrap gap-2">
            {(method.brands || []).map((brand) => (
              <li
                key={brand}
                className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-text-muted"
              >
                {brand}
              </li>
            ))}
          </ul>

          <p className="mt-3 text-xs text-text-muted">{method.description}</p>
          {checkoutReady ? <p className="mt-2 text-xs text-text-muted">{labels.secure}</p> : null}
        </>
      )}
    </section>
  );
}
