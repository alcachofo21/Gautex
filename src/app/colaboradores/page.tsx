import { corporate } from "@/lib/products";

export const metadata = {
  title: "Colaboradores",
  description: "Entidades públicas y privadas con las que trabaja Gautex Medica.",
};

export default function ColaboradoresPage() {
  return (
    <div className="py-12 sm:py-16">
      <div className="container-page max-w-4xl">
        <h1 className="text-fluid-title font-display font-bold">{corporate.partners.title}</h1>
        <p className="mt-4 text-text-muted">{corporate.partners.description}</p>

        <div className="mt-12 space-y-8">
          {corporate.partners.items.map((partner) => (
            <div
              key={partner.name}
              className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm"
            >
              <h2 className="font-display text-2xl font-bold text-primary">{partner.name}</h2>
              <p className="mt-4 leading-relaxed text-text-muted">{partner.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
