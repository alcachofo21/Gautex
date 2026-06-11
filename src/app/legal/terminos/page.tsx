import { corporate } from "@/lib/products";

export const metadata = { title: "Aviso legal" };

export default function TerminosPage() {
  return (
    <div className="container-page max-w-3xl py-12 sm:py-16">
      <h1 className="text-fluid-title font-display font-bold">Aviso legal</h1>
      <div className="mt-8 space-y-6 text-text-muted">
        <section>
          <h2 className="font-display text-lg font-bold text-text">Titular del sitio</h2>
          <p className="mt-2 leading-relaxed">
            {corporate.company.name}<br />
            {corporate.company.address}<br />
            Tel: {corporate.company.phone} · Fax: {corporate.company.fax}<br />
            Email: {corporate.company.email}
          </p>
        </section>
        <section>
          <h2 className="font-display text-lg font-bold text-text">Condiciones de uso</h2>
          <p className="mt-2 leading-relaxed">{corporate.legal.terms}</p>
        </section>
        <section>
          <h2 className="font-display text-lg font-bold text-text">Propiedad intelectual</h2>
          <p className="mt-2 leading-relaxed">
            Los contenidos de este sitio web (textos, imágenes, logotipos, diseño) son propiedad de GAUTEX MÉDICA, S.L.
            o de sus licenciantes. Queda prohibida su reproducción sin autorización expresa.
          </p>
        </section>
        <section>
          <h2 className="font-display text-lg font-bold text-text">Responsabilidad</h2>
          <p className="mt-2 leading-relaxed">
            La información publicada tiene carácter orientativo para profesionales del sector sanitario.
            GAUTEX MÉDICA, S.L. no se responsabiliza del uso indebido de los productos fuera de su indicación
            y normativa aplicable en cada país.
          </p>
        </section>
      </div>
    </div>
  );
}
