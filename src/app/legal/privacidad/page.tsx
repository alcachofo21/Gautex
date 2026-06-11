import { corporate } from "@/lib/products";

export const metadata = { title: "Política de privacidad" };

export default function PrivacidadPage() {
  const sections = corporate.legal.privacySections ?? [];

  return (
    <div className="container-page max-w-3xl py-12 sm:py-16">
      <h1 className="text-fluid-title font-display font-bold">Política de privacidad</h1>
      <div className="mt-8 space-y-6 text-text-muted">
        <p className="leading-relaxed">{corporate.legal.privacy}</p>
        {sections.map((s) => (
          <div key={s.title}>
            <h2 className="font-display text-lg font-bold text-text">{s.title}</h2>
            <p className="mt-2 leading-relaxed">{s.text}</p>
          </div>
        ))}
        <p>
          Contacto:{" "}
          <a href={`mailto:${corporate.company.email}`} className="text-primary hover:underline">
            {corporate.company.email}
          </a>
          {" · "}
          {corporate.company.address}
        </p>
      </div>
    </div>
  );
}
