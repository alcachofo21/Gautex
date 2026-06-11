import { corporate } from "@/lib/products";

export const metadata = { title: "Política de privacidad" };

export default function PrivacidadPage() {
  return (
    <div className="container-page max-w-3xl py-12 sm:py-16">
      <h1 className="text-fluid-title font-display font-bold">Política de privacidad</h1>
      <div className="prose mt-8 space-y-4 text-text-muted">
        <p>{corporate.legal.privacy}</p>
        <p>
          Los usuarios pueden ejercitar en cualquier momento los derechos reconocidos por el RGPD:
          acceso, rectificación, supresión, limitación, portabilidad y oposición.
        </p>
        <p>
          Contacto para ejercer derechos:{" "}
          <a href={`mailto:${corporate.company.email}`} className="text-primary hover:underline">
            {corporate.company.email}
          </a>
        </p>
        <p>{corporate.company.address}</p>
      </div>
    </div>
  );
}
