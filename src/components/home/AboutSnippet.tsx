import { Button } from "@/components/ui/Button";
import { getCorporate, getUi, localizedPath, type Locale } from "@/lib/locale";

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
          <h2 className="text-fluid-title font-display font-bold">{corporate.about.title}</h2>
          <p className="mt-4 text-text-muted">{corporate.about.paragraphs[0]}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {corporate.about.values.map((v) => (
              <span key={v} className="rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">{v}</span>
            ))}
          </div>
          <Button href={localizedPath("/nosotros", locale)} variant="outline" className="mt-8">
            {ui.about.cta}
          </Button>
        </div>
      </div>
    </section>
  );
}
