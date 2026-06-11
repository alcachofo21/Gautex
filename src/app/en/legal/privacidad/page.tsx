import { getCorporate } from "@/lib/locale";

export const metadata = { title: "Privacy policy" };

export default function EnPrivacidadPage() {
  const corporate = getCorporate("en");
  const sections = corporate.legal.privacySections ?? [];

  return (
    <div className="container-page max-w-3xl py-12 sm:py-16">
      <h1 className="text-fluid-title font-display font-bold">Privacy policy</h1>
      <div className="mt-8 space-y-6 text-text-muted">
        <p className="leading-relaxed">{corporate.legal.privacy}</p>
        {sections.map((s) => (
          <div key={s.title}>
            <h2 className="font-display text-lg font-bold text-text">{s.title}</h2>
            <p className="mt-2 leading-relaxed">{s.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
