import { Award, ShieldCheck, MapPin, Calendar } from "lucide-react";
import { getUi, type Locale } from "@/lib/locale";

const badgeIcons = [Award, ShieldCheck, ShieldCheck, Calendar, MapPin];

interface TrustBadgesProps {
  locale?: Locale;
}

export function TrustBadges({ locale = "es" }: TrustBadgesProps) {
  const ui = getUi(locale);

  return (
    <section className="bg-primary/5 py-12">
      <div className="container-page">
        <h2 className="text-fluid-title mb-8 text-center font-display font-bold">{ui.trust.title}</h2>
        <div className="flex flex-wrap justify-center gap-4">
          {ui.trust.badges.map((label, i) => {
            const Icon = badgeIcons[i] || Award;
            return (
              <div key={label} className="flex items-center gap-3 rounded-2xl border border-primary/20 bg-white px-6 py-4 shadow-sm">
                <Icon className="h-6 w-6 text-primary" />
                <span className="font-semibold text-text">{label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
