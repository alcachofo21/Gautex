import Image from "next/image";
import { Award, ShieldCheck } from "lucide-react";
import { getCorporate } from "@/lib/locale";

export const metadata = {
  title: "Quality & certifications",
  description: "ISO 13485, ISO 9001 and CE 0120 SGS certifications — Gautex Medica.",
};

export default function EnCalidadPage() {
  const corporate = getCorporate("en");

  return (
    <div className="py-12 sm:py-16">
      <div className="container-page max-w-5xl">
        <h1 className="text-fluid-title font-display font-bold">{corporate.quality.title}</h1>
        <p className="mt-4 text-xl text-text-muted">{corporate.quality.subtitle}</p>
        <div className="mt-10 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="relative aspect-[16/7] w-full">
            <Image src="/images/quality/certificaciones.jpg" alt="Gautex certifications" fill className="object-cover" sizes="1024px" priority />
          </div>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {corporate.quality.certifications.map((cert) => (
            <div key={cert.name} className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                <Award className="h-7 w-7 text-primary" />
              </div>
              <h2 className="font-display text-xl font-bold">{cert.name}</h2>
              <p className="mt-3 text-sm leading-relaxed text-text-muted">{cert.description}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col gap-4 rounded-2xl bg-primary/5 p-8 sm:flex-row sm:items-center">
          <ShieldCheck className="h-12 w-12 shrink-0 text-primary" />
          <div>
            <h3 className="font-display text-lg font-bold">Notified Body No. 0120 SGS</h3>
            <p className="mt-2 text-sm text-text-muted">
              Audited certifications ensuring the highest quality standards for medical products distributed across Europe.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
