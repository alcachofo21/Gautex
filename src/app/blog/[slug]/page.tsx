import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlogPost, getUi, localizedPath } from "@/lib/locale";
import { buildPageMetadata } from "@/lib/seo";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const { getBlogPosts } = await import("@/lib/locale");
  return getBlogPosts("es").map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug, "es");
  if (!post) return { title: "Blog" };
  return buildPageMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${slug}`,
    locale: "es",
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug, "es");
  if (!post) notFound();

  const ui = getUi("es").blog;

  return (
    <article className="py-12 sm:py-16">
      <div className="container-page max-w-3xl">
        <Link href={localizedPath("/blog", "es")} className="text-sm font-semibold text-primary hover:underline">
          ← {ui.back}
        </Link>
        <time className="mt-6 block text-sm text-text-muted">
          {new Date(post.date).toLocaleDateString("es-ES")}
        </time>
        <h1 className="text-fluid-title mt-2 font-display font-bold">{post.title}</h1>
        <div className="prose prose-neutral mt-8 max-w-none whitespace-pre-line text-text-muted">
          {post.body}
        </div>
      </div>
    </article>
  );
}
