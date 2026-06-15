import { Award, ShieldCheck, Briefcase, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { getCorporate, getUi, localizedPath, type Locale } from "@/lib/locale";

const valueIcons = [Award, ShieldCheck, Briefcase, Lightbulb];

interface AboutSnippetProps {
  locale?: Locale;
}

export function AboutSnippet({ locale = "es" }: AboutSnippetProps) {
  const corporate = getCorporate(locale);
  const ui = getUi(locale);

  return (
    <section className="bg-surface py-12 sm:py-16">
      <div className="container-page">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-accent">
            {corporate.company.slogan}
          </p>
          <h2 className="mt-2 text-fluid-title font-display font-bold">{corporate.about.title}</h2>
          <p className="mt-4 text-text-muted">{corporate.about.paragraphs[0]}</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {corporate.about.values.map((v, i) => {
              const Icon = valueIcons[i] || Award;
              return (
                <div
                  key={v}
                  className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm"
                >
                  <Icon className="h-5 w-5 shrink-0 text-primary" />
                  <span className="font-display font-semibold text-text">{v}</span>
                </div>
              );
            })}
          </div>
          <Button href={localizedPath("/nosotros", locale)} variant="outline" className="mt-8">
            {ui.about.cta}
          </Button>
        </div>
      </div>
    </section>
  );
}
