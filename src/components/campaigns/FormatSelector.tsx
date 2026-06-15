import Image from "next/image";
import type { CampaignFormat } from "@/types";
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
}

export function FormatSelector({ formats, selected, onSelect }: FormatSelectorProps) {
  const active = formats.find((f) => f.id === selected);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        {formats.map((format) => {
          const Icon = iconMap[format.icon] || Package;
          return (
            <button
              key={format.id}
              type="button"
              onClick={() => onSelect(format.id)}
              className={cn(
                "overflow-hidden rounded-2xl border-2 text-left transition-all hover:shadow-md",
                selected === format.id
                  ? "border-primary bg-primary/5 shadow-md"
                  : "border-gray-200 bg-white"
              )}
            >
              {format.image ? (
                <div className="relative h-36 w-full">
                  <Image src={format.image} alt={format.name} fill className="object-cover" sizes="50vw" />
                </div>
              ) : (
                <Icon className="m-6 mb-0 h-8 w-8 text-primary" />
              )}
              <div className="p-4">
                <h3 className="font-display font-bold">{format.name}</h3>
                <p className="mt-2 text-sm text-text-muted">{format.description}</p>
              </div>
            </button>
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
                Variantes disponibles
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
