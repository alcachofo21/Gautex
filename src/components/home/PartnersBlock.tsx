import Image from "next/image";
import Link from "next/link";
import { Award, ShieldCheck, Briefcase, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { getCorporate, getPartners, getUi, localizedPath, type Locale } from "@/lib/locale";

const valueIcons = [Award, ShieldCheck, Briefcase, Lightbulb];

interface PartnersBlockProps {
  locale?: Locale;
}

export function PartnersBlock({ locale = "es" }: PartnersBlockProps) {
  const corporate = getCorporate(locale);
  const ui = getUi(locale);
  const partners = getPartners(locale);

  return (
    <section className="bg-surface py-12 sm:py-16">
      <div className="container-page">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-accent">
            {corporate.company.slogan}
          </p>
          <h2 className="mt-2 text-fluid-title font-display font-bold">{corporate.about.title}</h2>
          <p className="mt-4 text-text-muted">{corporate.about.paragraphs[0]}</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {corporate.about.values.map((v, i) => {
              const Icon = valueIcons[i] || Award;
              return (
                <div
                  key={v}
                  className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm"
                >
                  <Icon className="h-5 w-5 shrink-0 text-primary" />
                  <span className="font-display text-sm font-semibold text-text">{v}</span>
                </div>
              );
            })}
          </div>
          <Button href={localizedPath("/nosotros", locale)} variant="outline" className="mt-6">
            {ui.about.cta}
          </Button>
        </div>

        <div className="text-center">
          <h3 className="font-display text-xl font-bold">{corporate.partners.title}</h3>
          <p className="mx-auto mt-4 max-w-2xl text-text-muted">{corporate.partners.description}</p>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {partners.featured.map((p) => (
            <div key={p.name} className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="relative h-16 w-24 shrink-0">
                <Image src={p.image} alt={p.name} fill className="object-contain" sizes="96px" quality={75} loading="lazy" />
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
                <Image src={logo.image} alt={logo.name} fill className="object-contain" sizes="80px" quality={75} loading="lazy" />
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
