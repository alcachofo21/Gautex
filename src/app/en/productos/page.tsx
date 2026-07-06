import { Suspense } from "react";
import { localizeProducts, products } from "@/lib/products";
import { getUi } from "@/lib/locale";
import { ShopCatalog } from "@/components/shop/ShopCatalog";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Online shop",
  description: "Buy condoms, lubricants, ultrasound probe covers and CE-certified medical supplies from Gautex Medica.",
  path: "/productos",
  locale: "en",
});

export default function EnProductosPage() {
  const ui = getUi("en");
  const allProducts = localizeProducts(products, "en");

  return (
    <div className="pb-16">
      <section className="border-b border-line bg-surface">
        <div className="container-page py-10 sm:py-14">
          <span className="text-eyebrow">{ui.nav.shop}</span>
          <h1 className="text-fluid-title mt-1 font-display font-bold">{ui.shopPage.title}</h1>
          <p className="mt-3 max-w-2xl text-text-muted">{ui.shopPage.subtitle}</p>
        </div>
      </section>

      <div className="container-page pt-8">
        <Suspense fallback={null}>
          <ShopCatalog products={allProducts} locale="en" />
        </Suspense>
      </div>
    </div>
  );
}
