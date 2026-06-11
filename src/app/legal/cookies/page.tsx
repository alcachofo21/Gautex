import { corporate } from "@/lib/products";

export const metadata = { title: "Política de cookies" };

export default function CookiesPage() {
  return (
    <div className="container-page max-w-3xl py-12 sm:py-16">
      <h1 className="text-fluid-title font-display font-bold">Política de cookies</h1>
      <div className="prose mt-8 space-y-4 text-text-muted">
        <p>{corporate.legal.cookies}</p>
        <h2 className="font-display text-xl font-bold text-text">Tipos de cookies</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li><strong>Técnicas:</strong> necesarias para el funcionamiento del sitio (carrito, preferencias).</li>
          <li><strong>De preferencias:</strong> recuerdan su consentimiento de cookies.</li>
        </ul>
        <p>
          Puede gestionar sus preferencias desde el banner de cookies o contactando en{" "}
          <a href={`mailto:${corporate.company.email}`} className="text-primary hover:underline">
            {corporate.company.email}
          </a>
        </p>
      </div>
    </div>
  );
}
