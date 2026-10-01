import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { getCampaigns, getUi, localizedPath, type Locale } from "@/lib/locale";
import { Package, Wallet, Box, Layers, Droplets, Sparkles, Heart } from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  package: Package,
  wallet: Wallet,
  box: Box,
  layers: Layers,
  droplets: Droplets,
  sparkles: Sparkles,
  heart: Heart,
};

interface CampaignFormatsShowcaseProps {
  locale?: Locale;
}

export function CampaignFormatsShowcase({ locale = "es" }: CampaignFormatsShowcaseProps) {
  const ui = getUi(locale);
  const t = ui.campaignsPage;
  const formats = getCampaigns(locale).formats;

  return (
    <section id="formatos" className="mt-12 scroll-mt-28">
      <div className="mb-8 max-w-2xl">
        <h2 className="font-display text-2xl font-bold">{t.formatsTitle}</h2>
        <p className="mt-2 text-text-muted">{t.formatsDesc}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {formats.map((format, index) => {
          const Icon = iconMap[format.icon] || Package;

          return (
            <article
              key={format.id}
              className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
            >
              {format.image ? (
                <div className="relative h-44 w-full bg-surface sm:h-52">
                  <Image
                    src={format.image}
                    alt={format.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    quality={75}
                    priority={index < 2}
                    loading={index < 2 ? undefined : "lazy"}
                  />
                </div>
              ) : (
                <div className="flex h-44 items-center justify-center bg-surface sm:h-52">
                  <Icon className="h-12 w-12 text-primary" />
                </div>
              )}

              <div className="p-5 sm:p-6">
                <h3 className="font-display text-xl font-bold text-text">{format.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-muted">{format.description}</p>

                <ul className="mt-4 space-y-1.5">
                  {format.details.map((detail) => (
                    <li key={detail} className="text-sm text-text-muted">
                      • {detail}
                    </li>
                  ))}
                </ul>

                {format.presentationOptions && format.presentationOptions.length > 0 && (
                  <div className="mt-4 border-t border-gray-100 pt-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                      {ui.campaigns.presentationLabel}
                    </p>
                    <ul className="mt-2 space-y-1">
                      {format.presentationOptions.map((opt) => (
                        <li key={opt.id} className="text-sm text-text-muted">
                          • {opt.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {format.variants && format.variants.length > 0 && (
                  <div className="mt-4 border-t border-gray-100 pt-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                      {ui.campaigns.variantsLabel}
                    </p>
                    <ul className="mt-2 space-y-3">
                      {format.variants.map((variant) => (
                        <li key={variant.id}>
                          <p className="text-sm font-semibold text-text">{variant.name}</p>
                          <p className="text-sm text-text-muted">{variant.description}</p>
                          {variant.details?.length > 0 && (
                            <ul className="mt-1 space-y-0.5">
                              {variant.details.map((d) => (
                                <li key={d} className="text-xs text-text-muted">
                                  • {d}
                                </li>
                              ))}
                            </ul>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-10 rounded-2xl border border-primary/15 bg-primary/5 p-6 text-center sm:p-8">
        <h3 className="font-display text-xl font-bold text-primary">{t.quoteTitle}</h3>
        <p className="mx-auto mt-2 max-w-xl text-sm text-text-muted">{t.quoteDesc}</p>
        <Button href={localizedPath("/contacto", locale)} size="lg" className="mt-6">
          {t.quoteCta}
        </Button>
      </div>
    </section>
  );
}
