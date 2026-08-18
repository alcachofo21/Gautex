import { ProductCatalogPage } from "@/components/shop/ProductCatalogPage";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Tienda online",
  description: "Catálogo Gautex Medica: preservativos de látex natural en caja de 144, geles y ginecología. ISO 13485:2016, ISO 9001 y CE MDR 2017/745.",
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
