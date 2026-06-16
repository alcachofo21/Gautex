import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlogPost, getUi, localizedPath } from "@/lib/locale";
import { buildPageMetadata } from "@/lib/seo";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const { getBlogPosts } = await import("@/lib/locale");
  return getBlogPosts("en").map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug, "en");
  if (!post) return { title: "Blog" };
  return buildPageMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${slug}`,
    locale: "en",
  });
}

export default async function EnBlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug, "en");
  if (!post) notFound();

  const ui = getUi("en").blog;

  return (
    <article className="py-12 sm:py-16">
      <div className="container-page max-w-3xl">
        <Link href={localizedPath("/blog", "en")} className="text-sm font-semibold text-primary hover:underline">
          ← {ui.back}
        </Link>
        <time className="mt-6 block text-sm text-text-muted">
          {new Date(post.date).toLocaleDateString("en-GB")}
        </time>
        <h1 className="text-fluid-title mt-2 font-display font-bold">{post.title}</h1>
        <div className="prose prose-neutral mt-8 max-w-none whitespace-pre-line text-text-muted">
          {post.body}
        </div>
      </div>
    </article>
  );
}
