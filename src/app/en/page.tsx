import { Hero } from "@/components/home/Hero";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { CampaignsBlock } from "@/components/home/CampaignsBlock";
import { ProcessSteps } from "@/components/home/ProcessSteps";
import { TrustBadges } from "@/components/home/TrustBadges";
import { PartnersBlock } from "@/components/home/PartnersBlock";
import { NewsletterContact } from "@/components/home/NewsletterContact";
import { StoreCta } from "@/components/home/StoreCta";
import { Testimonials } from "@/components/home/Testimonials";
import { CategoryCards } from "@/components/home/CategoryCards";
import { SectorSelector } from "@/components/home/SectorSelector";
import { StatsStrip } from "@/components/home/StatsStrip";
import { BrandFamilies } from "@/components/home/BrandFamilies";
import { BlogTeaser } from "@/components/home/BlogTeaser";
import { CampaignSuccessCases } from "@/components/campaigns/CampaignSuccessCases";
import { getFeaturedProducts, localizeProducts } from "@/lib/products";
import { getUi } from "@/lib/locale";

export const metadata = {
  title: "Gautex Medica - Spreading health",
  description: "Medical devices with CE marking under MDR 2017/745 for pharmacy and healthcare. Condoms, gels, COVID-19 tests and custom campaigns.",
};

export default function EnHomePage() {
  const featured = localizeProducts(getFeaturedProducts(), "en");
  const ui = getUi("en");

  return (
    <>
      <Hero locale="en" />
      <TrustBadges locale="en" />
      <StatsStrip locale="en" />
      <CategoryCards locale="en" />
      <CampaignsBlock locale="en" />
      <SectorSelector locale="en" />
      <section className="bg-surface py-12 sm:py-16">
        <div className="container-page">
          <h2 className="text-fluid-title mb-8 font-display font-bold">
            {ui.home.featured}
          </h2>
          <ProductGrid products={featured} locale="en" />
        </div>
      </section>
      <BrandFamilies locale="en" />
      <ProcessSteps locale="en" />
      <CampaignSuccessCases locale="en" compact />
      <Testimonials locale="en" />
      <PartnersBlock locale="en" />
      <BlogTeaser locale="en" />
      <StoreCta locale="en" />
      <NewsletterContact locale="en" />
    </>
  );
}
