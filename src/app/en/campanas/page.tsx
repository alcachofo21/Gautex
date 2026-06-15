import { CampaignConfigurator } from "@/components/campaigns/CampaignConfigurator";

export const metadata = {
  title: "Custom campaigns",
  description: "Customise condoms, cases, PVC sleeves and flow packs for prevention and public health campaigns.",
};

export default function EnCampanasPage() {
  return (
    <div className="py-12 sm:py-16">
      <div className="container-page">
        <h1 className="text-fluid-title font-display font-bold">Campaign customisation</h1>
        <p className="mt-4 max-w-3xl text-text-muted">
          A range of formats for prevention campaigns, advertising and events. Custom cases, PVC sleeves, condoms and flow packs.
        </p>
        <section className="mt-12">
          <h2 className="mb-6 font-display text-2xl font-bold">Configure your campaign</h2>
          <CampaignConfigurator />
        </section>
      </div>
    </div>
  );
}
