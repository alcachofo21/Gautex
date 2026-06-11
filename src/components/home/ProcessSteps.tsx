import { Package, Palette, Truck } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Package,
    title: "Elige producto",
    description: "Selecciona el producto o formato de campaña que mejor se adapte a tus necesidades.",
  },
  {
    number: "02",
    icon: Palette,
    title: "Personaliza diseño",
    description: "Sube tu logo y diseño para crear packaging único con tu marca.",
  },
  {
    number: "03",
    icon: Truck,
    title: "Recibe o distribuye",
    description: "Recibe presupuesto o confirma pedido. Distribución a toda Europa.",
  },
];

export function ProcessSteps() {
  return (
    <section className="py-12 sm:py-16">
      <div className="container-page">
        <h2 className="text-fluid-title mb-4 text-center font-display font-bold">
          De la idea al impacto en 3 pasos
        </h2>
        <p className="mx-auto mb-12 max-w-2xl text-center text-text-muted">
          Un proceso sencillo para productos estándar o campañas personalizadas de prevención.
        </p>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, i) => (
            <div key={step.number} className="relative text-center">
              {i < steps.length - 1 && (
                <div className="absolute left-[60%] top-10 hidden h-0.5 w-[80%] bg-primary/20 md:block" />
              )}
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary text-white shadow-lg">
                <step.icon className="h-9 w-9" />
              </div>
              <span className="text-sm font-bold text-accent">{step.number}</span>
              <h3 className="mt-2 font-display text-xl font-bold">{step.title}</h3>
              <p className="mt-2 text-sm text-text-muted">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
