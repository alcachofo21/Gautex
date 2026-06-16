import { CampaignConfigurator } from "@/components/campaigns/CampaignConfigurator";
import { CampaignGallery } from "@/components/campaigns/CampaignGallery";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Campañas personalizadas",
  description: "Personaliza preservativos, estuches, fundas PVC y flow packs para campañas de prevención y salud pública.",
  path: "/campanas",
  locale: "es",
});

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
          <h2 className="mb-6 font-display text-2xl font-bold">Configura tu campaña</h2>
          <CampaignConfigurator locale="es" />
        </section>

        <CampaignGallery locale="es" />
      </div>
    </div>
  );
}
