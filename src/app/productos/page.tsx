import { ProductCatalogPage } from "@/components/shop/ProductCatalogPage";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Tienda online",
  description: "Catálogo completo de productos sanitarios Gautex Medica: preventivo, ginecología y tests COVID-19.",
  path: "/productos",
  locale: "es",
});

export default function ProductosPage() {
  return <ProductCatalogPage locale="es" />;
}
