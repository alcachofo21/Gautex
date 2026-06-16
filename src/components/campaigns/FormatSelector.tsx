import Image from "next/image";
import { Check } from "lucide-react";
import type { CampaignFormat } from "@/types";
import { getUi, type Locale } from "@/lib/locale";
import { Package, Wallet, Box, Layers, Droplets, Sparkles, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ElementType> = {
  package: Package,
  wallet: Wallet,
  box: Box,
  layers: Layers,
  droplets: Droplets,
  sparkles: Sparkles,
  heart: Heart,
};

interface FormatSelectorProps {
  formats: CampaignFormat[];
  selected: string | null;
  onSelect: (id: string) => void;
  locale?: Locale;
}

export function FormatSelector({ formats, selected, onSelect, locale = "es" }: FormatSelectorProps) {
  const ui = getUi(locale);
  const active = formats.find((f) => f.id === selected);

  return (
    <div className="relative z-0 space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        {formats.map((format) => {
          const Icon = iconMap[format.icon] || Package;
          const isSelected = selected === format.id;
          const inputId = `campaign-format-${format.id}`;

          return (
            <div key={format.id} className="relative">
              <input
                id={inputId}
                type="radio"
                name="campaign-format"
                value={format.id}
                checked={isSelected}
                onChange={() => onSelect(format.id)}
                className="peer sr-only"
              />
              <label
                htmlFor={inputId}
                className={cn(
                  "relative z-10 flex w-full cursor-pointer touch-manipulation flex-col overflow-hidden rounded-2xl border-2 text-left transition-all",
                  "hover:border-primary/50 hover:shadow-md",
                  isSelected
                    ? "border-primary bg-primary/10 shadow-md ring-2 ring-primary/25"
                    : "border-gray-200 bg-white"
                )}
              >
                {isSelected && (
                  <span className="absolute right-3 top-3 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white shadow-sm">
                    <Check className="h-4 w-4" strokeWidth={3} />
                  </span>
                )}
                {format.image ? (
                  <div className="pointer-events-none relative h-36 w-full shrink-0">
                    <Image
                      src={format.image}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 50vw"
                      draggable={false}
                      quality={75}
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <Icon className="pointer-events-none m-6 mb-0 h-8 w-8 text-primary" />
                )}
                <div className="pointer-events-none p-4">
                  <h3 className="font-display font-bold text-text">{format.name}</h3>
                  <p className="mt-2 text-sm text-text-muted">{format.description}</p>
                </div>
              </label>
            </div>
          );
        })}
      </div>

      {active && (
        <div className="rounded-2xl border border-primary/20 bg-surface p-5 sm:p-6">
          <h4 className="font-display text-lg font-bold text-primary">{active.name}</h4>
          <p className="mt-2 text-sm text-text-muted">{active.description}</p>
          <ul className="mt-4 space-y-1">
            {active.details.map((d) => (
              <li key={d} className="text-sm text-text-muted">• {d}</li>
            ))}
          </ul>
          {active.variants && active.variants.length > 0 && (
            <div className="mt-4 border-t border-gray-200 pt-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                {ui.campaigns.variantsLabel}
              </p>
              <ul className="mt-2 space-y-2">
                {active.variants.map((variant) => (
                  <li key={variant.id} className="text-sm">
                    <span className="font-semibold text-text">{variant.name}</span>
                    <span className="text-text-muted"> — {variant.description}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
