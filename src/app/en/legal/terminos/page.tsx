import { getCorporate } from "@/lib/locale";

export const metadata = { title: "Legal notice" };

export default function EnTerminosPage() {
  const corporate = getCorporate("en");

  return (
    <div className="container-page max-w-3xl py-12 sm:py-16">
      <h1 className="text-fluid-title font-display font-bold">Legal notice</h1>
      <div className="mt-8 space-y-6 text-text-muted">
        <section>
          <h2 className="font-display text-lg font-bold text-text">Website owner</h2>
          <p className="mt-2 leading-relaxed">
            {corporate.company.name}<br />
            {corporate.company.address}<br />
            Tel: {corporate.company.phone} · Fax: {corporate.company.fax}<br />
            Email: {corporate.company.email}
          </p>
        </section>
        <section>
          <h2 className="font-display text-lg font-bold text-text">Terms of use</h2>
          <p className="mt-2 leading-relaxed">{corporate.legal.terms}</p>
        </section>
      </div>
    </div>
  );
}
