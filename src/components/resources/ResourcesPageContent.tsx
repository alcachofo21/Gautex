import Link from "next/link";
import { FileText, Award, BookOpen, ChevronRight } from "lucide-react";
import { shopProducts } from "@/lib/products";
import { getCorporate, getUi, localizedPath, type Locale } from "@/lib/locale";

interface ResourcesPageContentProps {
  locale?: Locale;
}

export function ResourcesPageContent({ locale = "es" }: ResourcesPageContentProps) {
  const ui = getUi(locale).resources;
  const corporate = getCorporate(locale);
  const productsByCategory = ui.categories.map((cat) => ({
    ...cat,
    products: shopProducts.filter((p) => p.category === cat.id),
  }));

  return (
    <div className="py-12 sm:py-16">
      <div className="container-page">
        <h1 className="text-fluid-title font-display font-bold">{ui.title}</h1>
        <p className="mt-4 max-w-3xl text-text-muted">{ui.subtitle}</p>

        <section className="mt-12">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <h2 className="font-display text-2xl font-bold">{ui.guideTitle}</h2>
          </div>
          <div className="rounded-2xl border border-primary/15 bg-primary/5 p-6">
            <p className="text-sm leading-relaxed text-text-muted">{ui.guideDesc}</p>
            <Link
              href={localizedPath("/campanas", locale)}
              className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
            >
              {ui.guideCta}
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        <section className="mt-12">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <h2 className="font-display text-2xl font-bold">{ui.datasheetsTitle}</h2>
          </div>
          <div className="space-y-8">
            {productsByCategory.map((cat) =>
              cat.products.length > 0 ? (
                <div key={cat.id}>
                  <h3 className="mb-4 font-display text-lg font-bold text-primary">{cat.label}</h3>
                  <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {cat.products.map((p) => (
                      <li key={p.id}>
                        <Link
                          href={localizedPath(`/productos/${p.category}/${p.slug}/ficha`, locale)}
                          className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm shadow-sm transition hover:border-primary/30 hover:shadow-md"
                        >
                          <span className="font-medium">{p.name}</span>
                          <ChevronRight className="h-4 w-4 shrink-0 text-primary" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null
            )}
          </div>
        </section>

        <section className="mt-12">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Award className="h-5 w-5 text-primary" />
            </div>
            <h2 className="font-display text-2xl font-bold">{ui.certsTitle}</h2>
          </div>
          <p className="mb-6 max-w-2xl text-sm text-text-muted">{ui.certsDesc}</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {corporate.quality.certifications.map((cert) => (
              <div
                key={cert.name}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <p className="text-xs font-semibold uppercase text-accent">{cert.scope}</p>
                <h3 className="mt-2 font-display font-bold">{cert.name}</h3>
                <p className="mt-2 text-sm text-text-muted">{cert.description}</p>
              </div>
            ))}
          </div>
          <Link
            href={localizedPath("/calidad", locale)}
            className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
          >
            {ui.certsCta}
            <ChevronRight className="h-4 w-4" />
          </Link>
        </section>
      </div>
    </div>
  );
}
