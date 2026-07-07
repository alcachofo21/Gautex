import { getUi, type Locale } from "@/lib/locale";

interface StatsStripProps {
  locale?: Locale;
  className?: string;
}

export function StatsStrip({ locale = "es", className = "" }: StatsStripProps) {
  const stats = getUi(locale).home.stats;

  return (
    <section className={`border-y border-gray-200 bg-white py-8 sm:py-10 ${className}`}>
      <div className="container-page">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-display text-2xl font-bold text-primary sm:text-3xl">{stat.value}</p>
              <p className="mt-1 text-xs leading-snug text-text-muted sm:text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
