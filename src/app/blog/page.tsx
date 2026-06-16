import { BlogList } from "@/components/blog/BlogList";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Noticias y novedades",
  description: "Actualidad del catálogo Gautex Medica, normativa sanitaria y campañas de prevención.",
  path: "/blog",
  locale: "es",
});

export default function BlogPage() {
  return <BlogList locale="es" />;
}
