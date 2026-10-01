import { CampaignFormatsShowcase } from "@/components/campaigns/CampaignFormatsShowcase";
import { CampaignGallery } from "@/components/campaigns/CampaignGallery";
import { CampaignPageHero } from "@/components/campaigns/CampaignPageHero";
import { CampaignSuccessCases } from "@/components/campaigns/CampaignSuccessCases";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Custom campaigns",
  description:
    "Campaign formats: cases, PVC wallets, custom condoms and flow packs for prevention and public health.",
  path: "/campanas",
  locale: "en",
});

export default function EnCampanasPage() {
  return (
    <div className="py-12 sm:py-16">
      <div className="container-page">
        <CampaignPageHero locale="en" />
        <CampaignFormatsShowcase locale="en" />
        <CampaignSuccessCases locale="en" />
        <CampaignGallery locale="en" />
      </div>
    </div>
  );
}
