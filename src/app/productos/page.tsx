import Link from "next/link";
import Image from "next/image";
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
                className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                {cat.image ? (
                  <div className="relative h-44 w-full">
                    <Image src={cat.image} alt={cat.name} fill className="object-cover" sizes="33vw" />
                  </div>
                ) : (
                  <div
                    className="m-8 mb-0 flex h-14 w-14 items-center justify-center rounded-xl text-white"
                    style={{ backgroundColor: cat.color }}
                  >
                    <Icon className="h-7 w-7" />
                  </div>
                )}
                <div className="p-8 pt-6">
                <h2 className="font-display text-xl font-bold group-hover:text-primary">{cat.name}</h2>
                <p className="mt-2 text-sm text-text-muted">{cat.description}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                  Ver productos <ChevronRight className="h-4 w-4" />
                </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
