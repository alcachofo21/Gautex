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
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {formats.map((format) => {
        const Icon = iconMap[format.icon] || Package;
        return (
          <button
            key={format.id}
            type="button"
            onClick={() => onSelect(format.id)}
            className={cn(
              "rounded-2xl border-2 p-6 text-left transition-all hover:shadow-md",
              selected === format.id
                ? "border-primary bg-primary/5 shadow-md"
                : "border-gray-200 bg-white"
            )}
          >
            <Icon className="mb-3 h-8 w-8 text-primary" />
            <h3 className="font-display font-bold">{format.name}</h3>
            <p className="mt-2 text-sm text-text-muted line-clamp-2">{format.description}</p>
          </button>
        );
      })}
    </div>
  );
}
