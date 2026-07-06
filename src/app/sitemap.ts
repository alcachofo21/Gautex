import { MetadataRoute } from "next";
import { products, categories } from "@/lib/products";
import { getBlogPosts, getSectors } from "@/lib/locale";
import { getSiteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();

  const staticPages = [
    "",
    "/productos",
    "/campanas",
    "/nosotros",
    "/calidad",
    "/colaboradores",
    "/contacto",
    "/blog",
    "/legal/privacidad",
    "/legal/cookies",
    "/legal/terminos",
    "/en",
    "/en/productos",
    "/en/campanas",
    "/en/nosotros",
    "/en/calidad",
    "/en/colaboradores",
    "/en/contacto",
    "/en/blog",
    "/en/legal/privacidad",
    "/en/legal/cookies",
    "/en/legal/terminos",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const sectorPages = [
    ...getSectors("es").map((s) => `/sectores/${s.id}`),
    ...getSectors("en").map((s) => `/en/sectors/${s.id}`),
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const blogPages = [
    ...getBlogPosts("es").map((p) => `/blog/${p.slug}`),
    ...getBlogPosts("en").map((p) => `/en/blog/${p.slug}`),
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const categoryPages = categories.map((c) => ({
    url: `${base}${c.href}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  const productPages = products.flatMap((p) => [
    {
      url: `${base}/productos/${p.category}/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${base}/en/productos/${p.category}/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
  ]);

  const enCategoryPages = categories.map((c) => ({
    url: `${base}/en/productos/${c.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...sectorPages, ...blogPages, ...categoryPages, ...enCategoryPages, ...productPages];
}
