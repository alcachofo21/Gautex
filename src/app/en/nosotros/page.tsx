import Image from "next/image";
import { getCorporate } from "@/lib/locale";

export const metadata = {
  title: "About us",
  description: "GAUTEX MÉDICA S.L. — Spreading health since 2002. CE-certified medical products in Europe.",
};

export default function EnNosotrosPage() {
  const corporate = getCorporate("en");

  return (
    <div className="py-12 sm:py-16">
      <div className="container-page max-w-5xl">
        <h1 className="text-fluid-title font-display font-bold">{corporate.about.title}</h1>
        <p className="mt-2 text-xl font-semibold text-primary">{corporate.company.slogan}</p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <Image src="/images/about/equipo.jpg" alt="Gautex Medica team" fill className="object-cover" sizes="50vw" />
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <Image src="/images/about/historia-condones.jpg" alt="Gautex history" fill className="object-cover" sizes="50vw" />
          </div>
        </div>
        <div className="mt-10 space-y-6 text-text-muted">
          {corporate.about.paragraphs.map((p, i) => (
            <p key={i} className="leading-relaxed">{p}</p>
          ))}
        </div>
        <div className="mt-12 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <h2 className="font-display text-xl font-bold">Our values</h2>
          <div className="mt-6 flex flex-wrap gap-4">
            {corporate.about.values.map((v) => (
              <span key={v} className="rounded-xl bg-primary px-6 py-3 font-display font-bold text-white">{v}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
