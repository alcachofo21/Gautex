import Image from "next/image";
import { getCorporate, getPartners } from "@/lib/locale";

export const metadata = {
  title: "Partners",
  description: "Public and private entities working with Gautex Medica.",
};

export default function EnColaboradoresPage() {
  const corporate = getCorporate("en");
  const partners = getPartners("en");

  return (
    <div className="py-12 sm:py-16">
      <div className="container-page">
        <h1 className="text-fluid-title font-display font-bold">{corporate.partners.title}</h1>
        <p className="mt-4 max-w-3xl text-text-muted">{corporate.partners.description}</p>
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {partners.featured.map((p) => (
            <div key={p.name} className="flex gap-6 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
              <div className="relative h-20 w-28 shrink-0">
                <Image src={p.image} alt={p.name} fill className="object-contain" sizes="112px" />
              </div>
              <div>
                <h2 className="font-display text-xl font-bold text-primary">{p.name}</h2>
                <p className="mt-3 leading-relaxed text-text-muted">{p.description}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12 space-y-8">
          {corporate.partners.items.map((partner) => (
            <div key={partner.name} className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
              <h2 className="font-display text-2xl font-bold text-primary">{partner.name}</h2>
              <p className="mt-4 leading-relaxed text-text-muted">{partner.description}</p>
            </div>
          ))}
        </div>
        <h2 className="mt-16 text-fluid-title font-display font-bold">Collaboration network</h2>
        <p className="mt-2 text-text-muted">
          Regional governments, healthcare entities and prevention organisations across Spain.
        </p>
        <div className="mt-8 grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
          {partners.logos.map((logo) => (
            <div key={logo.name} className="flex aspect-square items-center justify-center rounded-xl border border-gray-100 bg-white p-4 shadow-sm" title={logo.name}>
              <div className="relative h-full w-full">
                <Image src={logo.image} alt={logo.name} fill className="object-contain" sizes="100px" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
