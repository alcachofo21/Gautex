import Image from "next/image";
import { corporate } from "@/lib/products";

export const metadata = {
  title: "Quiénes somos",
  description: "GAUTEX MÉDICA S.L. — Repartiendo salud desde 2002. Productos sanitarios certificados en Europa.",
};

export default function NosotrosPage() {
  return (
    <div className="py-12 sm:py-16">
      <div className="container-page max-w-5xl">
        <h1 className="text-fluid-title font-display font-bold">{corporate.about.title}</h1>
        <p className="mt-2 text-xl font-semibold text-primary">{corporate.company.slogan}</p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <Image
              src="/images/about/equipo.jpg"
              alt="Equipo Gautex Medica"
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 50vw"
            />
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <Image
              src="/images/about/historia-condones.jpg"
              alt="Historia de preservativos Gautex"
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 50vw"
            />
          </div>
        </div>

        <div className="mt-10 space-y-6 text-text-muted">
          {corporate.about.paragraphs.map((p, i) => (
            <p key={i} className="leading-relaxed">{p}</p>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <h2 className="font-display text-xl font-bold">Nuestros valores</h2>
          <div className="mt-6 flex flex-wrap gap-4">
            {corporate.about.values.map((v) => (
              <span key={v} className="rounded-xl bg-primary px-6 py-3 font-display font-bold text-white">
                {v}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {[
            { year: "2002", label: "Fundación" },
            { year: "EU", label: "Mercado europeo" },
            { year: "0120", label: "SGS Notificado" },
          ].map((item) => (
            <div key={item.label} className="rounded-xl bg-surface p-6 text-center">
              <p className="font-display text-3xl font-bold text-primary">{item.year}</p>
              <p className="mt-1 text-sm text-text-muted">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
