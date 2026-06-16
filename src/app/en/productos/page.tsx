import { ProductCatalogPage } from "@/components/shop/ProductCatalogPage";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Online shop",
  description: "Full Gautex Medica catalogue: prevention, gynaecology and COVID-19 tests.",
  path: "/productos",
  locale: "en",
});

export default function EnProductosPage() {
  return <ProductCatalogPage locale="en" />;
}
