import { Package, Wallet, Layers, Box } from "lucide-react";
import { Button } from "@/components/ui/Button";

const highlights = [
  { icon: Package, title: "Estuche personalizado", desc: "350gr mate, frontal a todo color" },
  { icon: Wallet, title: "Funda PVC", desc: "9,5×6,5 cm, cuatricromía" },
  { icon: Layers, title: "Flow Pack", desc: "4 variantes de packaging" },
  { icon: Box, title: "Preservativos custom", desc: "Tiras de 3 uds o cajas 144 uds" },
];

export function CampaignsBlock() {
  return (
    <section className="bg-gradient-to-r from-primary to-primary-dark py-12 text-white sm:py-16">
      <div className="container-page">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-fluid-title font-display font-bold">
              Campañas que generan impacto
            </h2>
            <p className="mt-4 text-white/80">
              Personaliza preservativos, estuches, fundas PVC y flow packs para eventos, salud pública y prevención. Material que la gente recoge, usa y recuerda.
            </p>
            <Button href="/campanas" variant="primary" size="lg" className="mt-6 bg-accent hover:bg-accent-hover">
              Diseña tu campaña
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {highlights.map((item) => (
              <div key={item.title} className="rounded-xl bg-white/10 p-4 backdrop-blur">
                <item.icon className="mb-2 h-8 w-8 text-accent" />
                <h3 className="font-semibold">{item.title}</h3>
                <p className="mt-1 text-sm text-white/70">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
