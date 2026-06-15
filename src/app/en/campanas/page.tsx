import Image from "next/image";
import { CampaignConfigurator } from "@/components/campaigns/CampaignConfigurator";
import { campaigns } from "@/lib/products";
import type { CampaignFormat } from "@/types";
import { Package } from "lucide-react";

const formats = campaigns.formats as CampaignFormat[];

export const metadata = {
  title: "Custom campaigns",
  description: "Customise condoms, cases, PVC sleeves and flow packs for prevention and public health campaigns.",
};

export default function EnCampanasPage() {
  return (
    <div className="py-12 sm:py-16">
      <div className="container-page">
        <h1 className="text-fluid-title font-display font-bold">Campaign customisation</h1>
        <p className="mt-4 max-w-3xl text-text-muted">
          A range of formats for prevention campaigns, advertising and events. Custom cases, PVC sleeves, condoms and flow packs.
        </p>
        <section className="mt-12">
          <h2 className="mb-6 font-display text-2xl font-bold">Available formats</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {formats.map((format) => (
              <div key={format.id} className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                {format.image ? (
                  <div className="relative h-48 w-full">
                    <Image src={format.image} alt={format.name} fill className="object-cover" sizes="50vw" />
                  </div>
                ) : (
                  <Package className="m-6 mb-0 h-8 w-8 text-primary" />
                )}
                <div className="p-6">
                  <h3 className="font-display text-lg font-bold">{format.name}</h3>
                  <p className="mt-2 text-sm text-text-muted">{format.description}</p>
                  <ul className="mt-4 space-y-1">
                    {format.details.map((d) => (
                      <li key={d} className="text-xs text-text-muted">• {d}</li>
                    ))}
                  </ul>
                  {format.variants && format.variants.length > 0 && (
                    <div className="mt-4 border-t border-gray-100 pt-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                        Available variants
                      </p>
                      <ul className="mt-2 space-y-2">
                        {format.variants.map((variant) => (
                          <li key={variant.id} className="text-sm">
                            <span className="font-semibold text-text">{variant.name}</span>
                            <span className="text-text-muted"> — {variant.description}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
        <section className="mt-16">
          <h2 className="mb-6 font-display text-2xl font-bold">Configure your campaign</h2>
          <CampaignConfigurator />
        </section>
      </div>
    </div>
  );
}
