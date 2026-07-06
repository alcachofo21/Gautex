import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { getUi, localizedPath, type Locale } from "@/lib/locale";

interface ShopByCategoryProps {
  locale?: Locale;
}

export function ShopByCategory({ locale = "es" }: ShopByCategoryProps) {
  const ui = getUi(locale);
  const c = ui.shopPage.collections;

  const items = [
    {
      key: "preservativos",
      label: c.preservativos,
      img: "/images/products/matrix-condoms.webp",
      href: "/productos?tipo=preservativos",
      desc: locale === "en" ? "Natural latex, flavours & XL" : "Látex natural, sabores y XL",
      featured: true,
    },
    {
      key: "lubricantes",
      label: c.lubricantes,
      img: "/images/products/max-gel.webp",
      href: "/productos?tipo=lubricantes",
      desc: locale === "en" ? "Water-based single-dose gels" : "Geles monodosis base acuosa",
    },
    {
      key: "cubresondas",
      label: c.cubresondas,
      img: "/images/products/gecofun.webp",
      href: "/productos?tipo=cubresondas",
      desc: locale === "en" ? "For ultrasound transducers" : "Para transductor ecográfico",
    },
    {
      key: "tests",
      label: c.tests,
      img: "/images/products/nadal-covid.webp",
      href: "/productos?tipo=tests",
      desc: locale === "en" ? "COVID-19 antigen & antibody" : "COVID-19 antígenos y anticuerpos",
    },
    {
      key: "mascarillas",
      label: c.mascarillas,
      img: "/images/products/mascarilla-ffp2.webp",
      href: "/productos?tipo=mascarillas",
      desc: locale === "en" ? "Surgical & FFP-2" : "Quirúrgicas y FFP-2",
    },
    {
      key: "ecografia",
      label: c.ecografia,
      img: "/images/products/ultra-gecogel.webp",
      href: "/productos?tipo=ecografia",
      desc: locale === "en" ? "Conductive ultrasound gel" : "Gel conductor de ecografía",
    },
  ];

  return (
    <section className="py-12 sm:py-16">
      <div className="container-page">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <span className="text-eyebrow">{locale === "en" ? "Shop by category" : "Compra por categoría"}</span>
            <h2 className="text-fluid-title mt-1 font-display font-bold">{ui.home.categories}</h2>
          </div>
          <Link
            href={localizedPath("/productos", locale)}
            className="hidden shrink-0 items-center gap-1 text-sm font-semibold text-accent hover:underline sm:flex"
          >
            {ui.sectors.ctaShop}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-6">
          {items.map((item) => (
            <Link
              key={item.key}
              href={localizedPath(item.href, locale)}
              className={`card-hover group flex flex-col items-center rounded-2xl border border-line bg-white p-4 text-center ${
                item.featured ? "col-span-2 md:col-span-1" : ""
              }`}
            >
              <div className="relative mb-3 aspect-square w-full overflow-hidden rounded-xl bg-surface">
                <Image
                  src={item.img}
                  alt={item.label}
                  fill
                  className="object-contain p-3 transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 45vw, 180px"
                />
              </div>
              <h3 className="font-display text-sm font-bold text-text group-hover:text-accent">{item.label}</h3>
              <p className="mt-1 text-xs text-text-muted">{item.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
