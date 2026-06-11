import { Award, ShieldCheck } from "lucide-react";
import { corporate } from "@/lib/products";

export const metadata = {
  title: "Calidad y certificaciones",
  description: "Certificaciones ISO 13485, ISO 9001 y CE 0120 SGS de Gautex Medica.",
};

export default function CalidadPage() {
  return (
    <div className="py-12 sm:py-16">
      <div className="container-page max-w-4xl">
        <h1 className="text-fluid-title font-display font-bold">{corporate.quality.title}</h1>
        <p className="mt-4 text-xl text-text-muted">{corporate.quality.subtitle}</p>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {corporate.quality.certifications.map((cert) => (
            <div
              key={cert.name}
              className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm"
            >
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                <Award className="h-7 w-7 text-primary" />
              </div>
              <h2 className="font-display text-xl font-bold">{cert.name}</h2>
              <p className="mt-3 text-sm text-text-muted leading-relaxed">{cert.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 flex items-center gap-4 rounded-2xl bg-primary/5 p-8">
          <ShieldCheck className="h-12 w-12 shrink-0 text-primary" />
          <div>
            <h3 className="font-display text-lg font-bold">Organismo Notificador nº 0120 SGS</h3>
            <p className="mt-2 text-sm text-text-muted">
              Certificados auditados para garantizar los más altos estándares de calidad en productos sanitarios distribuidos en Europa.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
