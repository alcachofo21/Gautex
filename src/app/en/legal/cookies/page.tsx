import { getCorporate } from "@/lib/locale";

export const metadata = { title: "Cookie policy" };

export default function EnCookiesPage() {
  const corporate = getCorporate("en");
  const sections = corporate.legal.cookiesSections ?? [];

  return (
    <div className="container-page max-w-3xl py-12 sm:py-16">
      <h1 className="text-fluid-title font-display font-bold">Cookie policy</h1>
      <div className="mt-8 space-y-6 text-text-muted">
        <p className="leading-relaxed">{corporate.legal.cookies}</p>
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
