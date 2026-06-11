import { Hero } from "@/components/home/Hero";
import { CategoryCards } from "@/components/home/CategoryCards";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { CampaignsBlock } from "@/components/home/CampaignsBlock";
import { ProcessSteps } from "@/components/home/ProcessSteps";
import { TrustBadges } from "@/components/home/TrustBadges";
import { PartnersBlock } from "@/components/home/PartnersBlock";
import { AboutSnippet } from "@/components/home/AboutSnippet";
import { NewsletterContact } from "@/components/home/NewsletterContact";
import { StoreCta } from "@/components/home/StoreCta";
import { Testimonials } from "@/components/home/Testimonials";
import { getFeaturedProducts, localizeProducts } from "@/lib/products";
import { getUi } from "@/lib/locale";

export const metadata = {
  title: "Gautex Medica — Spreading health",
  description: "CE-certified medical products for pharmacy and healthcare. Condoms, gels, COVID-19 tests and custom campaigns.",
};

export default function EnHomePage() {
  const featured = localizeProducts(getFeaturedProducts(), "en");
  const ui = getUi("en");

  return (
    <>
      <Hero locale="en" />
      <CategoryCards locale="en" title={ui.home.categories} />
      <section className="py-12 sm:py-16">
        <div className="container-page">
          <h2 className="text-fluid-title mb-8 font-display font-bold">
            {ui.home.featured}
          </h2>
          <ProductGrid products={featured} locale="en" />
        </div>
      </section>
      <CampaignsBlock />
      <ProcessSteps />
      <Testimonials locale="en" />
      <TrustBadges />
      <PartnersBlock />
      <AboutSnippet />
      <StoreCta locale="en" />
      <NewsletterContact />
    </>
  );
}
