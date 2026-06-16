import Image from "next/image";
import { Package, Wallet, Layers, Box } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { getUi, localizedPath, type Locale } from "@/lib/locale";

interface CampaignsBlockProps {
  locale?: Locale;
}

export function CampaignsBlock({ locale = "es" }: CampaignsBlockProps) {
  const ui = getUi(locale);
  const b = ui.campaignsBlock;

  const highlights = [
    { icon: Package, title: b.estuche.title, desc: b.estuche.desc, image: "/images/campaigns/estuche.webp" },
    { icon: Wallet, title: b.funda.title, desc: b.funda.desc, image: "/images/campaigns/funda-pvc.webp" },
    { icon: Layers, title: b.flowPack.title, desc: b.flowPack.desc, image: "/images/campaigns/flow-pack.webp" },
    { icon: Box, title: b.custom.title, desc: b.custom.desc, image: "/images/campaigns/condoms-custom.webp" },
  ];

  return (
    <section className="bg-gradient-to-r from-primary to-primary-dark py-12 text-white sm:py-16">
      <div className="container-page">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-fluid-title font-display font-bold">{b.title}</h2>
            <p className="mt-4 text-white/80">{b.desc}</p>
            <Button href={localizedPath("/campanas", locale)} variant="primary" size="lg" className="mt-6 bg-accent hover:bg-accent-hover">
              {b.cta}
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {highlights.map((item) => (
              <div key={item.title} className="overflow-hidden rounded-xl bg-white/10 backdrop-blur">
                <div className="relative h-28 w-full">
                  <Image src={item.image} alt={item.title} fill className="object-cover opacity-80" sizes="200px" quality={75} loading="lazy" />
                </div>
                <div className="p-4">
                  <item.icon className="mb-2 h-6 w-6 text-accent" />
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="mt-1 text-sm text-white/70">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
