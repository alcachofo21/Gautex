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
import { getFeaturedProducts } from "@/lib/products";
import { getUi } from "@/lib/locale";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Gautex Medica — Repartiendo salud",
  description: "Distribución y fabricación de productos sanitarios con marcado CE MDR 2017/745. Preservativos, geles, tests COVID-19 y campañas personalizadas.",
  path: "/",
  locale: "es",
});

export default function HomePage() {
  const featured = getFeaturedProducts();
  const ui = getUi("es");

  return (
    <>
      <Hero locale="es" />
      <TrustBadges locale="es" />
      <StatsStrip locale="es" />
      <CategoryCards locale="es" />
      <CampaignsBlock locale="es" />
      <SectorSelector locale="es" />
      <section className="bg-surface py-12 sm:py-16">
        <div className="container-page">
          <h2 className="text-fluid-title mb-8 font-display font-bold">
            {ui.home.featured}
          </h2>
          <ProductGrid products={featured} locale="es" />
        </div>
      </section>
      <BrandFamilies locale="es" />
      <ProcessSteps locale="es" />
      <CampaignSuccessCases locale="es" compact />
      <Testimonials locale="es" />
      <PartnersBlock locale="es" />
      <BlogTeaser locale="es" />
      <StoreCta locale="es" />
      <NewsletterContact locale="es" />
    </>
  );
}
