import { Button } from "@/components/ui/Button";
import { getUi, localizedPath, type Locale } from "@/lib/locale";

interface StoreCtaProps {
  locale?: Locale;
}

export function StoreCta({ locale = "es" }: StoreCtaProps) {
  const ui = getUi(locale);
  return (
    <section className="py-12 sm:py-16">
      <div className="container-page">
        <div className="section-cta">
          <h2 className="text-fluid-title font-display font-bold">
            {ui.home.ctaTitle}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/80">
            {ui.home.ctaDesc}
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap">
            <Button href={localizedPath("/productos", locale)} size="lg" className="bg-accent hover:bg-accent-hover">
              {ui.home.ctaShop}
            </Button>
            <Button href={localizedPath("/contacto", locale)} variant="outline" size="lg" className="border-white/40 bg-white/10 text-white hover:bg-white/20">
              {ui.home.ctaQuote}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
