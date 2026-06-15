import { corporate } from "@/lib/products";
import { AboutPageContent } from "@/components/about/AboutPageContent";

export const metadata = {
  title: "Quiénes somos",
  description:
    "GAUTEX MÉDICA S.L. — Repartiendo salud desde 2002. Distribución y fabricación de productos sanitarios certificados en Europa.",
};

export default function NosotrosPage() {
  return (
    <div className="py-12 sm:py-16">
      <div className="container-page max-w-5xl">
        <h1 className="text-fluid-title font-display font-bold">{corporate.about.title}</h1>
        <AboutPageContent locale="es" />
      </div>
    </div>
  );
}
