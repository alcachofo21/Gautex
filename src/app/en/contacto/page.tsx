import { ContactForm } from "@/app/contacto/ContactForm";
import { getCorporate } from "@/lib/locale";
import { Phone, Mail, MapPin, Clock, Printer } from "lucide-react";

export const metadata = {
  title: "Contact",
  description: "Contact Gautex Medica. Form, phone and opening hours.",
};

const mapQuery = encodeURIComponent("Plaza Dr. Letamendi 37, 08007 Barcelona");

export default function EnContactoPage() {
  const corporate = getCorporate("en");

  return (
    <div className="py-12 sm:py-16">
      <div className="container-page">
        <h1 className="text-fluid-title font-display font-bold">Contact</h1>
        <p className="mt-4 text-text-muted">
          The easiest way to reach us. Please fill in all required fields.
        </p>
        <div className="mt-12 grid gap-12 lg:grid-cols-2">
          <ContactForm />
          <div className="space-y-6">
            <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-sm">
              <iframe
                title="Gautex Medica location"
                src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
                className="h-56 w-full border-0 sm:h-64"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="font-display text-lg font-bold">Contact details</h2>
              <ul className="mt-6 space-y-4">
                <li className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-5 w-5 text-primary" />
                  <a href={`tel:${corporate.company.phone.replace(/-/g, "")}`} className="hover:text-primary">{corporate.company.phone}</a>
                </li>
                <li className="flex items-start gap-3">
                  <Printer className="mt-0.5 h-5 w-5 text-primary" />
                  <span>Fax: {corporate.company.fax}</span>
                </li>
                <li className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-5 w-5 text-primary" />
                  <a href={`mailto:${corporate.company.email}`} className="hover:text-primary">{corporate.company.email}</a>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 text-primary" />
                  <span>{corporate.company.address}</span>
                </li>
                <li className="flex items-start gap-3">
                  <Clock className="mt-0.5 h-5 w-5 text-primary" />
                  <p>{corporate.company.schedule.en}</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
