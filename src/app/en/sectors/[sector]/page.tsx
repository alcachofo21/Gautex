import { SectorPageContent } from "@/components/sectors/SectorPageContent";
import { getSectors, getSectorAlternatePaths } from "@/lib/locale";
import { buildPageMetadata } from "@/lib/seo";

interface Props {
  params: Promise<{ sector: string }>;
}

export async function generateStaticParams() {
  return getSectors("en").map((s) => ({ sector: s.id }));
}

export async function generateMetadata({ params }: Props) {
  const { sector: id } = await params;
  const sector = getSectors("en").find((s) => s.id === id);
  if (!sector) return { title: "Sectors" };
  return buildPageMetadata({
    title: sector.title,
    description: sector.description,
    path: `/sectors/${id}`,
    locale: "en",
    image: sector.image,
    alternatePaths: getSectorAlternatePaths(id),
  });
}

export default async function EnSectorPage({ params }: Props) {
  const { sector } = await params;
  return <SectorPageContent sectorId={sector} locale="en" />;
}
