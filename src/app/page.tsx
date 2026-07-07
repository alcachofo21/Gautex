import { Hero } from "@/components/home/Hero";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { CampaignsBlock } from "@/components/home/CampaignsBlock";
import { ProcessSteps } from "@/components/home/ProcessSteps";
import { TrustBadges } from "@/components/home/TrustBadges";
import { PartnersBlock } from "@/components/home/PartnersBlock";
import { Testimonials } from "@/components/home/Testimonials";
import { AboutSnippet } from "@/components/home/AboutSnippet";
import { NewsletterContact } from "@/components/home/NewsletterContact";
import { StoreCta } from "@/components/home/StoreCta";
import { getFeaturedProducts } from "@/lib/products";
import { getUi } from "@/lib/locale";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Gautex Medica - Repartiendo salud",
  description: "Distribución y fabricación de productos sanitarios certificados CE. Preservativos, geles, tests COVID-19 y campañas personalizadas.",
  path: "/",
  locale: "es",
});

export default function HomePage() {
  const featured = getFeaturedProducts();
  const ui = getUi("es");

  return (
    <>
      <Hero locale="es" />
      <section className="py-12 sm:py-16">
        <div className="container-page">
          <h2 className="text-fluid-title mb-8 font-display font-bold">
            {ui.home.featured}
          </h2>
          <ProductGrid products={featured} locale="es" />
        </div>
      </section>
      <CampaignsBlock locale="es" />
      <ProcessSteps locale="es" />
      <Testimonials locale="es" />
      <TrustBadges locale="es" />
      <PartnersBlock locale="es" />
      <AboutSnippet locale="es" />
      <StoreCta locale="es" />
      <NewsletterContact locale="es" />
    </>
  );
}
