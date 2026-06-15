import Image from "next/image";
import Link from "next/link";
import { getCorporate, getPartners, getUi, localizedPath, type Locale } from "@/lib/locale";

interface PartnersBlockProps {
  locale?: Locale;
}

export function PartnersBlock({ locale = "es" }: PartnersBlockProps) {
  const corporate = getCorporate(locale);
  const ui = getUi(locale);
  const partners = getPartners(locale);

  return (
    <section className="py-12 sm:py-16">
      <div className="container-page">
        <div className="text-center">
          <h2 className="text-fluid-title font-display font-bold">{corporate.partners.title}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-text-muted">{corporate.partners.description}</p>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {partners.featured.map((p) => (
            <div key={p.name} className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="relative h-16 w-24 shrink-0">
                <Image src={p.image} alt={p.name} fill className="object-contain" sizes="96px" />
              </div>
              <div>
                <h3 className="font-display font-bold text-primary">{p.name}</h3>
                <p className="mt-1 text-sm text-text-muted">{p.description}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-10 grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
          {partners.logos.map((logo) => (
            <div key={logo.name} className="flex aspect-square items-center justify-center rounded-xl border border-gray-100 bg-white p-3 shadow-sm" title={logo.name}>
              <div className="relative h-full w-full">
                <Image src={logo.image} alt={logo.name} fill className="object-contain" sizes="80px" />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link href={localizedPath("/colaboradores", locale)} className="text-sm font-semibold text-primary hover:underline">
            {ui.partners.viewAll}
          </Link>
        </div>
      </div>
    </section>
  );
}
