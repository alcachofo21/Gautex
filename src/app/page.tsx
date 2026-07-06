import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Hero } from "@/components/home/Hero";
import { ShopByCategory } from "@/components/home/ShopByCategory";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { CampaignsBlock } from "@/components/home/CampaignsBlock";
import { ProcessSteps } from "@/components/home/ProcessSteps";
import { TrustBadges } from "@/components/home/TrustBadges";
import { PartnersBlock } from "@/components/home/PartnersBlock";
import { Testimonials } from "@/components/home/Testimonials";
import { AboutSnippet } from "@/components/home/AboutSnippet";
import { NewsletterContact } from "@/components/home/NewsletterContact";
import { StoreCta } from "@/components/home/StoreCta";
import { getFeaturedProducts, sortByCollection } from "@/lib/products";
import { getUi, localizedPath } from "@/lib/locale";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Gautex Medica — Repartiendo salud",
  description: "Distribución y fabricación de productos sanitarios certificados CE. Preservativos, geles, tests COVID-19 y campañas personalizadas.",
  path: "/",
  locale: "es",
});

export default function HomePage() {
  const featured = sortByCollection(getFeaturedProducts());
  const ui = getUi("es");

  return (
    <>
      <Hero locale="es" />
      <ShopByCategory locale="es" />
      <section className="bg-surface py-12 sm:py-16">
        <div className="container-page">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <span className="text-eyebrow">Más vendidos</span>
              <h2 className="text-fluid-title mt-1 font-display font-bold">{ui.home.featured}</h2>
            </div>
            <Link
              href={localizedPath("/productos", "es")}
              className="hidden shrink-0 items-center gap-1 text-sm font-semibold text-accent hover:underline sm:flex"
            >
              {ui.sectors.ctaShop}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
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
