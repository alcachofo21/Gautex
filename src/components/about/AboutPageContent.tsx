import Image from "next/image";
import Link from "next/link";
import {
  Award,
  Briefcase,
  Building2,
  ChevronRight,
  Factory,
  Globe,
  Lightbulb,
  MapPin,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { getCorporate, getUi, localizedPath, type Locale } from "@/lib/locale";
import type corporateEs from "../../../content/corporate.json";

type AboutData = (typeof corporateEs)["about"];
type CompanyData = (typeof corporateEs)["company"];

const valueIcons = [Award, ShieldCheck, Briefcase, Lightbulb];
const activityIcons = [Truck, Building2, Factory];

const productLines = [
  {
    image: "/images/categories/ginecologia.webp",
    labelEs: "Ginecología",
    labelEn: "Gynaecology",
  },
  {
    image: "/images/categories/preventivo.webp",
    labelEs: "Prevención",
    labelEn: "Prevention",
  },
  {
    image: "/images/marketing/ad-matrix-condoms.webp",
    labelEs: "Matrix Condoms",
    labelEn: "Matrix Condoms",
  },
];

interface AboutPageContentProps {
  locale?: Locale;
}

export function AboutPageContent({ locale = "es" }: AboutPageContentProps) {
  const corporate = getCorporate(locale);
  const ui = getUi(locale);
  const about: AboutData = corporate.about;
  const company: CompanyData = corporate.company;
  const t = ui.about;

  return (
    <>
      <section className="relative mt-10 overflow-hidden rounded-3xl bg-primary text-white">
        <div className="absolute inset-0">
          <Image
            src="/images/marketing/ad-hero-gautex.webp"
            alt=""
            fill
            className="object-cover opacity-20"
            sizes="(max-width: 1024px) 100vw, 1024px"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/95 to-primary-dark/90" />
        </div>

        <div className="relative grid gap-8 p-8 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center lg:p-12">
          <div>
            <div className="mb-4 flex flex-wrap gap-2">
              <Badge className="bg-white/15 text-white backdrop-blur">CE 0120 SGS</Badge>
              <Badge className="bg-accent/90 text-white">ISO 13485</Badge>
              <Badge className="bg-white/15 text-white backdrop-blur">
                {locale === "es" ? `Desde ${company.founded}` : `Since ${company.founded}`}
              </Badge>
            </div>
            <p className="text-2xl font-display font-bold text-accent sm:text-3xl">{company.slogan}</p>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
              {about.paragraphs[0]}
            </p>
            <div className="mt-6 flex items-center gap-2 text-sm text-white/70">
              <MapPin className="h-4 w-4 shrink-0 text-accent" />
              <span>{t.headquarters}</span>
            </div>
          </div>

          <div className="relative flex shrink-0 items-center justify-center lg:justify-end">
            <div
              className="pointer-events-none absolute h-40 w-40 rounded-full bg-white/10 blur-3xl"
              aria-hidden
            />
            <div className="relative h-28 w-52 sm:h-32 sm:w-60">
              <Image
                src="/images/logo/gautex.webp"
                alt={company.name}
                fill
                className="object-contain drop-shadow-[0_12px_28px_rgba(0,0,0,0.45)]"
                sizes="(max-width: 640px) 208px, 240px"
                quality={80}
              />
            </div>
          </div>
        </div>
      </section>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {about.stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm"
          >
            <p className="font-display text-3xl font-bold text-primary">{stat.value}</p>
            <p className="mt-2 text-sm leading-snug text-text-muted">{stat.label}</p>
          </div>
        ))}
      </div>

      <section className="mt-16">
        <h2 className="font-display text-2xl font-bold">{t.historyTitle}</h2>
        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_340px] lg:items-start">
          <div className="space-y-5 text-base leading-relaxed text-text-muted">
            {about.paragraphs.slice(1).map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>

          <div className="space-y-4">
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="relative aspect-[4/3]">
                <Image
                  src="/images/quality/certificaciones.webp"
                  alt={
                    locale === "es"
                      ? "Certificaciones de calidad Gautex Medica"
                      : "Gautex Medica quality certifications"
                  }
                  fill
                  className="object-cover"
                  sizes="340px"
                  quality={75}
                  loading="lazy"
                />
              </div>
            </div>
            <blockquote className="rounded-2xl border border-primary/15 bg-primary/5 p-6">
              <p className="font-display text-lg font-semibold leading-snug text-primary">
                {about.missionQuote}
              </p>
            </blockquote>
          </div>
        </div>
      </section>

      <section className="mt-16">
        <h2 className="font-display text-2xl font-bold">{t.activitiesTitle}</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {about.activities.map((activity, i) => {
            const Icon = activityIcons[i] || Truck;
            return (
              <div
                key={activity.title}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-display text-lg font-bold">{activity.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-muted">{activity.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-16 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm sm:p-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <h2 className="font-display text-2xl font-bold">{t.teamTitle}</h2>
            <p className="mt-4 leading-relaxed text-text-muted">{about.paragraphs[4]}</p>
            <p className="mt-4 leading-relaxed text-text-muted">{about.teamParagraph}</p>
          </div>
          <div className="flex flex-wrap gap-3 lg:justify-end">
            {about.values.map((value, i) => {
              const Icon = valueIcons[i] || Award;
              return (
                <div
                  key={value}
                  className="flex items-center gap-2 rounded-xl bg-primary/5 px-4 py-3"
                >
                  <Icon className="h-5 w-5 text-primary" />
                  <span className="font-display text-sm font-bold text-primary">{value}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mt-16">
        <h2 className="font-display text-2xl font-bold">{t.valuesTitle}</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {about.values.map((value, i) => {
            const Icon = valueIcons[i] || Award;
            return (
              <div
                key={value}
                className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm"
              >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                  <Icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-display text-lg font-bold">{value}</h3>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="font-display text-2xl font-bold">{t.productsTitle}</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {productLines.map((line) => (
            <div
              key={line.image}
              className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
            >
              <div className="relative aspect-[16/10]">
                <Image
                  src={line.image}
                  alt={locale === "es" ? line.labelEs : line.labelEn}
                  fill
                  className="object-cover"
                  sizes="33vw"
                  quality={75}
                  loading="lazy"
                />
              </div>
              <p className="p-4 text-center text-sm font-semibold text-text">
                {locale === "es" ? line.labelEs : line.labelEn}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16 flex flex-col gap-6 rounded-2xl bg-primary/5 p-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-4">
          <ShieldCheck className="h-12 w-12 shrink-0 text-primary" />
          <div>
            <h2 className="font-display text-xl font-bold">{t.qualityTitle}</h2>
            <p className="mt-2 text-sm leading-relaxed text-text-muted">{t.qualityDesc}</p>
          </div>
        </div>
        <Link
          href={localizedPath("/calidad", locale)}
          className="inline-flex items-center gap-1 font-semibold text-primary hover:text-accent"
        >
          {t.qualityCta}
          <ChevronRight className="h-4 w-4" />
        </Link>
      </section>

      <div className="mt-12 flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-center">
        <Button href={localizedPath("/contacto", locale)} size="lg">
          {t.contactCta}
        </Button>
        <Button href={localizedPath("/productos", locale)} variant="outline" size="lg">
          {locale === "es" ? "Ver productos" : "View products"}
        </Button>
      </div>

      <div className="mt-10 flex items-center justify-center gap-2 text-sm text-text-muted">
        <Globe className="h-4 w-4 text-primary" />
        <span>
          {locale === "es"
            ? "Presencia importante en el mercado europeo"
            : "Strong presence across the European market"}
        </span>
      </div>
    </>
  );
}
