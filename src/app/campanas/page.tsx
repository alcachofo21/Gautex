import Image from "next/image";
import { CampaignConfigurator } from "@/components/campaigns/CampaignConfigurator";
import { campaigns } from "@/lib/products";
import type { CampaignFormat } from "@/types";
import { Package } from "lucide-react";

const formats = campaigns.formats as CampaignFormat[];

export const metadata = {
  title: "Campañas personalizadas",
  description: "Personaliza preservativos, estuches, fundas PVC y flow packs para campañas de prevención y salud pública.",
};

export default function CampanasPage() {
  return (
    <div className="py-12 sm:py-16">
      <div className="container-page">
        <h1 className="text-fluid-title font-display font-bold">
          Personalizaciones para campañas
        </h1>
        <p className="mt-4 max-w-3xl text-text-muted">
          Variedad de modalidades para campañas preventivas, publicidad y eventos. Estuches, fundas PVC, preservativos personalizados y flow packs.
        </p>

        <section className="mt-12">
          <h2 className="mb-6 font-display text-2xl font-bold">Formatos disponibles</h2>
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
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <h2 className="mb-6 font-display text-2xl font-bold">Configura tu campaña</h2>
          <CampaignConfigurator />
        </section>
      </div>
    </div>
  );
}
