"use client";

import { Button } from "@/components/ui/Button";
import type { EnabledPaymentMethod, PaymentProvider } from "@/lib/payments/types";

interface InstantPaymentPanelProps {
  methods: EnabledPaymentMethod[];
  totalLabel: string;
  loading: boolean;
  selectedProvider: PaymentProvider | null;
  onSelectProvider: (provider: PaymentProvider) => void;
  onPay: () => void;
  labels: {
    title: string;
    subtitle: string;
    chooseMethod: string;
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
  selectedProvider,
  onSelectProvider,
  onPay,
  labels,
  payable,
  checkoutReady,
}: InstantPaymentPanelProps) {
  const selected = methods.find((m) => m.id === selectedProvider) ?? methods[0];
  const payLabel = selected ? selected.label : labels.payNow;
  const isPayPal = selected?.id === "paypal";

  return (
    <section className="mt-6 rounded-2xl border border-primary/20 bg-primary/5 p-6">
      <h2 className="font-display text-lg font-bold text-primary">{labels.title}</h2>
      <p className="mt-1 text-sm text-text-muted">{labels.subtitle}</p>

      {!payable ? (
        <p className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {labels.notPayable}
        </p>
      ) : !checkoutReady || methods.length === 0 ? (
        <>
          <p className="mt-4 text-2xl font-bold text-text">{totalLabel}</p>
          <p className="mt-4 rounded-xl bg-blue-50 px-4 py-3 text-sm text-blue-900">
            {labels.pendingSetup}
          </p>
        </>
      ) : (
        <>
          <p className="mt-4 text-2xl font-bold text-text">{totalLabel}</p>

          {methods.length > 1 && (
            <fieldset className="mt-4">
              <legend className="mb-2 text-sm font-medium text-text">{labels.chooseMethod}</legend>
              <div className="space-y-2">
                {methods.map((method) => {
                  const active = selected?.id === method.id;
                  return (
                    <label
                      key={method.id}
                      className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-colors ${
                        active
                          ? "border-primary bg-white shadow-sm"
                          : "border-gray-200 bg-white/60 hover:border-primary/40"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment-method"
                        value={method.id}
                        checked={active}
                        onChange={() => onSelectProvider(method.id)}
                        className="mt-1 h-4 w-4 accent-primary"
                      />
                      <span>
                        <span className="block font-semibold text-text">{method.label}</span>
                        <span className="block text-xs text-text-muted">{method.description}</span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          )}

          <Button
            fullWidth
            onClick={onPay}
            disabled={loading}
            className={`mt-4 font-semibold ${
              isPayPal
                ? "bg-[#0070ba] hover:bg-[#003087]"
                : "bg-primary hover:bg-primary-dark"
            }`}
          >
            {payLabel}
          </Button>

          {methods.length === 1 && (
            <p className="mt-3 text-xs text-text-muted">{selected?.description}</p>
          )}
          <p className="mt-2 text-xs text-text-muted">{labels.secure}</p>
        </>
      )}
    </section>
  );
}
