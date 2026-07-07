import { ResourcesPageContent } from "@/components/resources/ResourcesPageContent";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Resources and documentation",
  description: "Datasheets, ISO certifications and guides for healthcare professionals.",
  path: "/recursos",
  locale: "en",
});

export default function EnRecursosPage() {
  return <ResourcesPageContent locale="en" />;
}
