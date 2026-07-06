import { ProductCatalogPage } from "@/components/shop/ProductCatalogPage";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Tienda online",
  description: "Catálogo completo de productos sanitarios Gautex Medica: preventivo, ginecología y tests COVID-19.",
  path: "/productos",
  locale: "es",
});

export default async function ProductosPage({
  searchParams,
}: {
  searchParams: Promise<{ c?: string }>;
}) {
  const { c } = await searchParams;
  return <ProductCatalogPage locale="es" categoryFilter={c ?? null} />;
}
