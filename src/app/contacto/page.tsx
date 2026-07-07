import { ContactForm } from "./ContactForm";
import { FaqSection } from "@/components/faq/FaqSection";
import { corporate } from "@/lib/products";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

export const metadata = {
  title: "Contacto",
  description: "Contacta con Gautex Medica. Formulario, teléfono y horario de atención.",
};

const mapQuery = encodeURIComponent(corporate.company.mapQuery);

export default function ContactoPage() {
  return (
    <div className="py-12 sm:py-16">
      <div className="container-page">
        <h1 className="text-fluid-title font-display font-bold">Contacto</h1>
        <p className="mt-4 text-text-muted">
          La forma más sencilla de ponerse en contacto con nosotros. Rellene todos los campos obligatorios.
        </p>

        <div className="mt-12 grid gap-12 lg:grid-cols-2">
          <ContactForm />

          <div className="space-y-6">
            <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-sm">
              <iframe
                title="Ubicación Gautex Medica"
                src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
                className="h-56 w-full border-0 sm:h-64"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="font-display text-lg font-bold">Datos de contacto</h2>
              <ul className="mt-6 space-y-4">
                <li className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-5 w-5 text-primary" />
                  <a href={`tel:${corporate.company.phone.replace(/-/g, "")}`} className="hover:text-primary">
                    {corporate.company.phone}
                  </a>
                </li>
                <li className="flex items-start gap-3 text-text-muted">
                  <span className="mt-0.5 w-5 text-center text-sm font-bold">F</span>
                  <span>Fax: {corporate.company.fax}</span>
                </li>
                <li className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-5 w-5 text-primary" />
                  <a href={`mailto:${corporate.company.email}`} className="hover:text-primary">
                    {corporate.company.email}
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <p className="font-medium text-text">{corporate.company.street}</p>
                    <p className="text-text-muted">
                      {corporate.company.floor}, {corporate.company.office}
                    </p>
                    <p className="text-text-muted">
                      {corporate.company.postalCode} {corporate.company.city}
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Clock className="mt-0.5 h-5 w-5 text-primary" />
                  <div>
                    <p>{corporate.company.schedule.es}</p>
                    <p className="text-sm text-text-muted">{corporate.company.schedule.en}</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl bg-surface p-6 text-sm text-text-muted">
              <h3 className="font-semibold text-text">Protección de datos (RGPD)</h3>
              <p className="mt-3 leading-relaxed">{corporate.legal.privacy}</p>
            </div>
          </div>
        </div>

        <FaqSection locale="es" className="mt-16" />
      </div>
    </div>
  );
}
