import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Hero } from "@/components/home/Hero";
import { ShopByCategory } from "@/components/home/ShopByCategory";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { CampaignsBlock } from "@/components/home/CampaignsBlock";
import { ProcessSteps } from "@/components/home/ProcessSteps";
import { TrustBadges } from "@/components/home/TrustBadges";
import { PartnersBlock } from "@/components/home/PartnersBlock";
import { AboutSnippet } from "@/components/home/AboutSnippet";
import { NewsletterContact } from "@/components/home/NewsletterContact";
import { StoreCta } from "@/components/home/StoreCta";
import { Testimonials } from "@/components/home/Testimonials";
import { getFeaturedProducts, localizeProducts, sortByCollection } from "@/lib/products";
import { getUi, localizedPath } from "@/lib/locale";

export const metadata = {
  title: "Gautex Medica — Spreading health",
  description: "CE-certified medical products for pharmacy and healthcare. Condoms, gels, COVID-19 tests and custom campaigns.",
};

export default function EnHomePage() {
  const featured = localizeProducts(sortByCollection(getFeaturedProducts()), "en");
  const ui = getUi("en");

  return (
    <>
      <Hero locale="en" />
      <ShopByCategory locale="en" />
      <section className="bg-surface py-12 sm:py-16">
        <div className="container-page">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <span className="text-eyebrow">Best sellers</span>
              <h2 className="text-fluid-title mt-1 font-display font-bold">{ui.home.featured}</h2>
            </div>
            <Link
              href={localizedPath("/productos", "en")}
              className="hidden shrink-0 items-center gap-1 text-sm font-semibold text-accent hover:underline sm:flex"
            >
              {ui.sectors.ctaShop}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <ProductGrid products={featured} locale="en" />
        </div>
      </section>
      <CampaignsBlock locale="en" />
      <ProcessSteps locale="en" />
      <Testimonials locale="en" />
      <TrustBadges locale="en" />
      <PartnersBlock locale="en" />
      <AboutSnippet locale="en" />
      <StoreCta locale="en" />
      <NewsletterContact locale="en" />
    </>
  );
}
