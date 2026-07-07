import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { getUi, type Locale } from "@/lib/locale";

interface CampaignPageHeroProps {
  locale?: Locale;
}

export function CampaignPageHero({ locale = "es" }: CampaignPageHeroProps) {
  const ui = getUi(locale).campaignsPage;

  return (
    <section className="relative overflow-hidden rounded-3xl bg-primary text-white">
      <div className="absolute inset-0">
        <Image
          src="/images/marketing/ad-campaign-estuche.webp"
          alt=""
          fill
          className="object-cover opacity-25"
          sizes="(max-width: 1024px) 100vw, 1024px"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/95 to-primary-dark/90" />
      </div>
      <div className="relative grid gap-8 p-8 sm:p-10 lg:grid-cols-2 lg:items-center lg:p-12">
        <div>
          <div className="mb-4 flex flex-wrap gap-2">
            <Badge className="bg-white/15 text-white backdrop-blur">CE 0120</Badge>
            <Badge className="bg-accent/90 text-white">{ui.badge}</Badge>
          </div>
          <h1 className="text-fluid-title font-display font-bold">{ui.title}</h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-white/80">{ui.desc}</p>
          <Button
            href="#configurador"
            size="lg"
            className="mt-6 bg-accent hover:bg-accent-hover"
          >
            {ui.cta}
          </Button>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {ui.steps.map((step, i) => (
            <div key={step.title} className="rounded-xl bg-white/10 p-4 backdrop-blur">
              <span className="text-sm font-bold text-accent">{String(i + 1).padStart(2, "0")}</span>
              <h2 className="mt-2 font-display text-sm font-bold">{step.title}</h2>
              <p className="mt-1 text-xs text-white/70">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
