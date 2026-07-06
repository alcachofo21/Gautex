import { Suspense } from "react";
import { products } from "@/lib/products";
import { getUi } from "@/lib/locale";
import { ShopCatalog } from "@/components/shop/ShopCatalog";

export const metadata = {
  title: "Tienda online",
  description:
    "Compra online preservativos, lubricantes, cubresondas, tests y material sanitario certificado CE de Gautex Medica.",
};

export default function ProductosPage() {
  const ui = getUi("es");

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
          <ShopCatalog products={products} locale="es" />
        </Suspense>
      </div>
    </div>
  );
}
