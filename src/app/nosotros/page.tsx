import { corporate } from "@/lib/products";

export const metadata = {
  title: "Quiénes somos",
  description: "GAUTEX MÉDICA S.L. — Repartiendo salud desde 2002. Productos sanitarios certificados en Europa.",
};

export default function NosotrosPage() {
  return (
    <div className="py-12 sm:py-16">
      <div className="container-page max-w-4xl">
        <h1 className="text-fluid-title font-display font-bold">{corporate.about.title}</h1>
        <p className="mt-2 text-xl font-semibold text-primary">{corporate.company.slogan}</p>

        <div className="mt-8 space-y-6 text-text-muted">
          {corporate.about.paragraphs.map((p, i) => (
            <p key={i} className="leading-relaxed">{p}</p>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <h2 className="font-display text-xl font-bold">Nuestros valores</h2>
          <div className="mt-6 flex flex-wrap gap-4">
            {corporate.about.values.map((v) => (
              <span
                key={v}
                className="rounded-xl bg-primary px-6 py-3 font-display font-bold text-white"
              >
                {v}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {[
            { year: "2002", label: "Fundación" },
            { year: "EU", label: "Mercado europeo" },
            { year: "0120", label: "SGS Notificado" },
          ].map((item) => (
            <div key={item.label} className="rounded-xl bg-surface p-6 text-center">
              <p className="font-display text-3xl font-bold text-primary">{item.year}</p>
              <p className="mt-1 text-sm text-text-muted">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
