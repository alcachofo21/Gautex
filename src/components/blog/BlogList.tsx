import Link from "next/link";
import { getBlogPosts, getUi, localizedPath, type Locale } from "@/lib/locale";

interface BlogListProps {
  locale?: Locale;
}

export function BlogList({ locale = "es" }: BlogListProps) {
  const posts = getBlogPosts(locale);
  const ui = getUi(locale).blog;

  return (
    <div className="py-12 sm:py-16">
      <div className="container-page">
        <h1 className="text-fluid-title font-display font-bold">{ui.title}</h1>
        <p className="mt-4 max-w-2xl text-text-muted">{ui.subtitle}</p>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <article key={post.slug} className="flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <time className="text-xs font-semibold uppercase text-text-muted">
                {new Date(post.date).toLocaleDateString(locale === "en" ? "en-GB" : "es-ES")}
              </time>
              <h2 className="mt-3 font-display text-xl font-bold">{post.title}</h2>
              <p className="mt-2 flex-1 text-sm text-text-muted">{post.excerpt}</p>
              <Link
                href={localizedPath(`/blog/${post.slug}`, locale)}
                className="mt-4 text-sm font-semibold text-primary hover:underline"
              >
                {ui.readMore} →
              </Link>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
