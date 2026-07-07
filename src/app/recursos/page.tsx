import { ResourcesPageContent } from "@/components/resources/ResourcesPageContent";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Recursos y documentación",
  description: "Fichas técnicas, certificaciones ISO y guías para profesionales del sector sanitario.",
  path: "/recursos",
  locale: "es",
});

export default function RecursosPage() {
  return <ResourcesPageContent locale="es" />;
}
