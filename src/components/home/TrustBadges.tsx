import { Award, ShieldCheck, MapPin, Calendar } from "lucide-react";

const badges = [
  { icon: Award, label: "ISO 13485:2013" },
  { icon: ShieldCheck, label: "ISO 9001:2008" },
  { icon: ShieldCheck, label: "CE 0120 SGS" },
  { icon: Calendar, label: "Desde 2002" },
  { icon: MapPin, label: "Barcelona" },
];

export function TrustBadges() {
  return (
    <section className="bg-primary/5 py-12">
      <div className="container-page">
        <h2 className="text-fluid-title mb-8 text-center font-display font-bold">
          Confianza certificada
        </h2>
        <div className="flex flex-wrap justify-center gap-4">
          {badges.map((badge) => (
            <div
              key={badge.label}
              className="flex items-center gap-3 rounded-2xl border border-primary/20 bg-white px-6 py-4 shadow-sm"
            >
              <badge.icon className="h-6 w-6 text-primary" />
              <span className="font-semibold text-text">{badge.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
