import { CampaignFormatsShowcase } from "@/components/campaigns/CampaignFormatsShowcase";
import { CampaignGallery } from "@/components/campaigns/CampaignGallery";
import { CampaignPageHero } from "@/components/campaigns/CampaignPageHero";
import { CampaignSuccessCases } from "@/components/campaigns/CampaignSuccessCases";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Campañas personalizadas",
  description:
    "Formatos de campaña: estuches, fundas PVC, preservativos personalizados y flow packs para prevención y salud pública.",
  path: "/campanas",
  locale: "es",
});

export default function CampanasPage() {
  return (
    <div className="py-12 sm:py-16">
      <div className="container-page">
        <CampaignPageHero locale="es" />
        <CampaignFormatsShowcase locale="es" />
        <CampaignSuccessCases locale="es" />
        <CampaignGallery locale="es" />
      </div>
    </div>
  );
}
