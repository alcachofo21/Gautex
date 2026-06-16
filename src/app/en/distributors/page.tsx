import { DistributorPortal } from "@/components/distributors/DistributorPortal";
import { getUi } from "@/lib/locale";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Distributor area",
  description: "Access for authorised Gautex Medica distributors.",
  path: "/distribuidores",
  locale: "en",
  noIndex: true,
});

export default function EnDistributorsPage() {
  const ui = getUi("en").distributors;

  return (
    <div className="py-12 sm:py-16">
      <div className="container-page max-w-3xl">
        <h1 className="text-fluid-title font-display font-bold">{ui.title}</h1>
        <p className="mt-4 text-text-muted">{ui.subtitle}</p>
        <div className="mt-10">
          <DistributorPortal locale="en" />
        </div>
      </div>
    </div>
  );
}
