import { CampaignConfigurator } from "@/components/campaigns/CampaignConfigurator";
import { CampaignGallery } from "@/components/campaigns/CampaignGallery";
import { CampaignPageHero } from "@/components/campaigns/CampaignPageHero";
import { CampaignSuccessCases } from "@/components/campaigns/CampaignSuccessCases";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Custom campaigns",
  description: "Customise condoms, cases, PVC sleeves and flow packs for prevention and public health campaigns.",
  path: "/campanas",
  locale: "en",
});

export default function EnCampanasPage() {
  return (
    <div className="py-12 sm:py-16">
      <div className="container-page">
        <CampaignPageHero locale="en" />

        <section id="configurador" className="mt-12 scroll-mt-28">
          <h2 className="mb-6 font-display text-2xl font-bold">Configure your campaign</h2>
          <CampaignConfigurator locale="en" />
        </section>

        <CampaignSuccessCases locale="en" />
        <CampaignGallery locale="en" />
      </div>
    </div>
  );
}
