import { corporate } from "@/lib/products";
import { QualityPageContent } from "@/components/quality/QualityPageContent";
import { getUi } from "@/lib/locale";

export const metadata = {
  title: "Calidad y certificaciones",
  description:
    "Certificaciones ISO 13485, ISO 9001 y auditorías del Organismo Notificador 0120 (SGS) - Gautex Medica.",
};

export default function CalidadPage() {
  const ui = getUi("es");
  return (
    <div className="py-12 sm:py-16">
      <div className="container-page max-w-5xl">
        <h1 className="text-fluid-title font-display font-bold">{corporate.quality.title}</h1>
        <p className="mt-4 text-xl text-text-muted">{corporate.quality.subtitle}</p>
        <QualityPageContent
          quality={corporate.quality}
          resourcesHref="/recursos"
          resourcesLabel={ui.resources.certsCta}
        />
      </div>
    </div>
  );
}
