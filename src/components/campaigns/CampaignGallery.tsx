import Image from "next/image";
import { getUi, type Locale } from "@/lib/locale";

const galleryItems = [
  { src: "/images/marketing/ad-campaign-estuche.png", key: "estuche" as const },
  { src: "/images/marketing/ad-campaign-funda-pvc.png", key: "funda" as const },
  { src: "/images/marketing/ad-viva-condoms-cyan.png", key: "condoms" as const },
  { src: "/images/marketing/ad-maxgel-lubricante.png", key: "gel" as const },
  { src: "/images/marketing/ad-ultra-gecogel.png", key: "gecogel" as const },
  { src: "/images/marketing/ad-covid-test-nadal.png", key: "covid" as const },
];

interface CampaignGalleryProps {
  locale?: Locale;
}

export function CampaignGallery({ locale = "es" }: CampaignGalleryProps) {
  const ui = getUi(locale);
  const g = ui.campaignGallery;

  return (
    <section className="mt-16">
      <h2 className="mb-2 font-display text-2xl font-bold">{g.title}</h2>
      <p className="mb-8 max-w-2xl text-text-muted">{g.desc}</p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {galleryItems.map((item) => (
          <figure
            key={item.src}
            className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
          >
            <div className="relative aspect-[4/3] bg-surface">
              <Image src={item.src} alt={g.items[item.key]} fill className="object-contain p-4" sizes="33vw" />
            </div>
            <figcaption className="border-t px-4 py-3 text-sm font-medium text-text-muted">
              {g.items[item.key]}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
