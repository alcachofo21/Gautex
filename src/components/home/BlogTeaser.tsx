import Link from "next/link";
import { getBlogPosts, getUi, localizedPath, type Locale } from "@/lib/locale";

interface BlogTeaserProps {
  locale?: Locale;
  limit?: number;
}

export function BlogTeaser({ locale = "es", limit = 3 }: BlogTeaserProps) {
  const posts = getBlogPosts(locale).slice(0, limit);
  const ui = getUi(locale).home.blog;

  if (posts.length === 0) return null;

  return (
    <section className="bg-white py-12 sm:py-16">
      <div className="container-page">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-fluid-title font-display font-bold">{ui.title}</h2>
            <p className="mt-2 text-text-muted">{ui.subtitle}</p>
          </div>
          <Link
            href={localizedPath("/blog", locale)}
            className="text-sm font-semibold text-primary hover:underline"
          >
            {ui.viewAll} →
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="flex flex-col rounded-2xl border border-gray-200 bg-surface p-6 shadow-sm transition-all hover:border-primary/20 hover:shadow-md"
            >
              <time className="text-xs font-semibold uppercase text-text-muted">
                {new Date(post.date).toLocaleDateString(locale === "en" ? "en-GB" : "es-ES", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
              <h3 className="mt-3 font-display text-lg font-bold leading-snug">{post.title}</h3>
              <p className="mt-2 flex-1 text-sm text-text-muted line-clamp-3">{post.excerpt}</p>
              <Link
                href={localizedPath(`/blog/${post.slug}`, locale)}
                className="mt-4 text-sm font-semibold text-primary hover:underline"
              >
                {getUi(locale).blog.readMore} →
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
