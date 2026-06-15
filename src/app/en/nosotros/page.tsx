import { getCorporate } from "@/lib/locale";
import { AboutPageContent } from "@/components/about/AboutPageContent";

export const metadata = {
  title: "About us",
  description:
    "GAUTEX MÉDICA S.L. — Spreading health since 2002. Certified medical product distribution and manufacturing in Europe.",
};

export default function EnNosotrosPage() {
  const corporate = getCorporate("en");

  return (
    <div className="py-12 sm:py-16">
      <div className="container-page max-w-5xl">
        <h1 className="text-fluid-title font-display font-bold">{corporate.about.title}</h1>
        <AboutPageContent locale="en" />
      </div>
    </div>
  );
}
