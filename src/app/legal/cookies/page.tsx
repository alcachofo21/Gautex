import { corporate } from "@/lib/products";

export const metadata = { title: "Política de cookies" };

export default function CookiesPage() {
  const sections = corporate.legal.cookiesSections ?? [];

  return (
    <div className="container-page max-w-3xl py-12 sm:py-16">
      <h1 className="text-fluid-title font-display font-bold">Política de cookies</h1>
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
