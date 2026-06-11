import { corporate } from "@/lib/products";

export function PartnersBlock() {
  return (
    <section className="py-12 sm:py-16">
      <div className="container-page text-center">
        <h2 className="text-fluid-title mb-4 font-display font-bold">
          Colaboradores y confianza
        </h2>
        <p className="mx-auto mb-8 max-w-2xl text-text-muted">
          {corporate.partners.description}
        </p>
        <div className="flex flex-wrap justify-center gap-6">
          {corporate.partners.items.map((partner) => (
            <div
              key={partner.name}
              className="flex min-w-[200px] flex-col items-center rounded-2xl border border-gray-200 bg-white px-8 py-6 shadow-sm"
            >
              <span className="font-display text-lg font-bold text-primary">
                {partner.name}
              </span>
              <p className="mt-2 text-center text-xs text-text-muted line-clamp-3">
                {partner.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
