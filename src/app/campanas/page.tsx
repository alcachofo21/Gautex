import { CampaignConfigurator } from "@/components/campaigns/CampaignConfigurator";
import { CampaignGallery } from "@/components/campaigns/CampaignGallery";
import { CampaignPageHero } from "@/components/campaigns/CampaignPageHero";
import { CampaignSuccessCases } from "@/components/campaigns/CampaignSuccessCases";
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
        <CampaignPageHero locale="es" />

        <section id="configurador" className="mt-12 scroll-mt-28">
          <h2 className="mb-6 font-display text-2xl font-bold">Configura tu campaña</h2>
          <CampaignConfigurator locale="es" />
        </section>

        <CampaignSuccessCases locale="es" />
        <CampaignGallery locale="es" />
      </div>
    </div>
  );
}
