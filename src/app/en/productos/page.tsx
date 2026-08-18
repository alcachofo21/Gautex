import { ProductCatalogPage } from "@/components/shop/ProductCatalogPage";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Online shop",
  description: "Gautex Medica catalogue: natural latex condoms in 144-unit boxes, gels and gynaecology. ISO 13485:2016, ISO 9001 and CE MDR 2017/745.",
  path: "/productos",
  locale: "en",
});

export default async function EnProductosPage({
  searchParams,
}: {
  searchParams: Promise<{ c?: string }>;
}) {
  const { c } = await searchParams;
  return <ProductCatalogPage locale="en" categoryFilter={c ?? null} />;
}
