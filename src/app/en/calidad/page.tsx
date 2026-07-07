import { getCorporate, getUi } from "@/lib/locale";
import { QualityPageContent } from "@/components/quality/QualityPageContent";

export const metadata = {
  title: "Quality & certifications",
  description:
    "ISO 13485, ISO 9001 certifications and Notified Body 0120 (SGS) audits - Gautex Medica.",
};

export default function EnCalidadPage() {
  const corporate = getCorporate("en");
  const ui = getUi("en");

  return (
    <div className="py-12 sm:py-16">
      <div className="container-page max-w-5xl">
        <h1 className="text-fluid-title font-display font-bold">{corporate.quality.title}</h1>
        <p className="mt-4 text-xl text-text-muted">{corporate.quality.subtitle}</p>
        <QualityPageContent
          quality={corporate.quality}
          resourcesHref="/en/recursos"
          resourcesLabel={ui.resources.certsCta}
        />
      </div>
    </div>
  );
}
