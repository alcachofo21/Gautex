import Image from "next/image";
import catalog from "../../../content/image-catalog.json";

export const metadata = {
  title: "Galería de imágenes",
  description: "Catálogo visual de productos, campañas y material promocional Gautex Medica.",
};

type CatalogSection = (typeof catalog.sections)[number];

export default function ImagenesPage() {
  return (
    <div className="py-12 sm:py-16">
      <div className="container-page">
        <h1 className="text-fluid-title font-display font-bold">Galería de imágenes</h1>
        <p className="mt-4 max-w-3xl text-text-muted">
          Todas las imágenes de la web mejoradas al estilo promocional premium. Incluye anuncios HD originales
          Versiones WebP optimizadas para tienda, categorías, campañas y hero.
        </p>

        {catalog.sections.map((section: CatalogSection) => (
          <section key={section.title} className="mt-14">
            <h2 className="font-display text-2xl font-bold">{section.title}</h2>
            <p className="mt-2 text-sm text-text-muted">{section.description}</p>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {section.items.map((item, index) => (
                <figure
                  key={item.file}
                  className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-lg"
                >
                  <div className="relative aspect-square bg-surface">
                    <Image
                      src={`${section.folder}/${item.file}`}
                      alt={item.label}
                      fill
                      className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, 33vw"
                      quality={75}
                      loading={index < 6 ? undefined : "lazy"}
                    />
                  </div>
                  <figcaption className="border-t border-gray-100 px-4 py-3">
                    <p className="font-semibold text-text">{item.label}</p>
                    <p className="mt-0.5 font-mono text-xs text-text-muted">{item.file}</p>
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
