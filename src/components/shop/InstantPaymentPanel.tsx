"use client";

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

          <Button
            fullWidth
            onClick={onPay}
            disabled={loading || !checkoutReady}
            className="mt-4 bg-[#0070ba] font-semibold hover:bg-[#003087] disabled:opacity-60"
          >
            {labels.payNow}
          </Button>

          {!checkoutReady ? (
            <p className="mt-3 rounded-xl bg-blue-50 px-4 py-3 text-sm text-blue-900">{labels.pendingSetup}</p>
          ) : null}

          <p className="mt-3 text-xs text-text-muted">{method.description}</p>
          {checkoutReady ? <p className="mt-2 text-xs text-text-muted">{labels.secure}</p> : null}
        </>
      )}
    </section>
  );
}
