import { BlogList } from "@/components/blog/BlogList";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "News and updates",
  description: "Gautex Medica catalogue updates, medical regulations and prevention campaigns.",
  path: "/blog",
  locale: "en",
});

export default function EnBlogPage() {
  return <BlogList locale="en" />;
}
