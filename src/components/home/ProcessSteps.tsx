import { Package, Palette, Truck } from "lucide-react";
import { getUi, type Locale } from "@/lib/locale";

const icons = [Package, Palette, Truck];

interface ProcessStepsProps {
  locale?: Locale;
}

export function ProcessSteps({ locale = "es" }: ProcessStepsProps) {
  const ui = getUi(locale);

  return (
    <section className="py-12 sm:py-16">
      <div className="container-page">
        <h2 className="text-fluid-title mb-4 text-center font-display font-bold">{ui.process.title}</h2>
        <p className="mx-auto mb-12 max-w-2xl text-center text-text-muted">{ui.process.subtitle}</p>
        <div className="grid gap-8 md:grid-cols-3">
          {ui.process.steps.map((step, i) => {
            const Icon = icons[i] || Package;
            return (
              <div key={step.title} className="relative text-center">
                {i < ui.process.steps.length - 1 && (
                  <div className="absolute left-[60%] top-10 hidden h-0.5 w-[80%] bg-primary/20 md:block" />
                )}
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary text-white shadow-lg">
                  <Icon className="h-9 w-9" />
                </div>
                <span className="text-sm font-bold text-accent">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-2 font-display text-xl font-bold">{step.title}</h3>
                <p className="mt-2 text-sm text-text-muted">{step.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
