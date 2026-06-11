import Link from "next/link";
import { Shield, HeartPulse, Microscope, ChevronRight } from "lucide-react";
import { categories } from "@/lib/products";

const iconMap: Record<string, React.ElementType> = {
  shield: Shield,
  "heart-pulse": HeartPulse,
  microscope: Microscope,
};

export const metadata = {
  title: "Productos",
  description: "Catálogo de productos sanitarios Gautex Medica: preventivo, ginecología y tests COVID-19.",
};

export default function ProductosPage() {
  return (
    <div className="py-12 sm:py-16">
      <div className="container-page">
        <h1 className="text-fluid-title font-display font-bold">Nuestros productos</h1>
        <p className="mt-4 max-w-2xl text-text-muted">
          Explora nuestras tres líneas de productos sanitarios certificados para farmacia, hospital y distribución gross.
        </p>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {categories.map((cat) => {
            const Icon = iconMap[cat.icon] || Shield;
            return (
              <Link
                key={cat.id}
                href={cat.href}
                className="group rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                <div
                  className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl text-white"
                  style={{ backgroundColor: cat.color }}
                >
                  <Icon className="h-7 w-7" />
                </div>
                <h2 className="font-display text-xl font-bold group-hover:text-primary">{cat.name}</h2>
                <p className="mt-2 text-sm text-text-muted">{cat.description}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                  Ver productos <ChevronRight className="h-4 w-4" />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
