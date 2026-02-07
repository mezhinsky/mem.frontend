import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://mezhinsky.me";

interface Article {
  slug: string;
  updatedAt: string;
}

interface Tag {
  slug: string;
  updatedAt: string;
}

async function getArticles(): Promise<Article[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/public/articles`,
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) return [];

    const data = await res.json();
    const items = (data?.articles ??
      data?.items ??
      data?.data ??
      data) as unknown;

    return Array.isArray(items) ? items : [];
  } catch {
    return [];
  }
}

async function getTags(): Promise<Tag[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/public/tags`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];

    const data = await res.json();
    const items = (data?.tags ?? data?.items ?? data?.data ?? data) as unknown;

    return Array.isArray(items) ? items : [];
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, tags] = await Promise.all([getArticles(), getTags()]);

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SITE_URL}/articles`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/resume`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/resume1`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  const articlePages: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${SITE_URL}/articles/${article.slug}`,
    lastModified: new Date(article.updatedAt),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const tagPages: MetadataRoute.Sitemap = tags.map((tag) => ({
    url: `${SITE_URL}/tags/${tag.slug}`,
    lastModified: new Date(tag.updatedAt),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticPages, ...articlePages, ...tagPages];
}
