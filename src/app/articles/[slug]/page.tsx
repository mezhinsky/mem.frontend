import { notFound } from "next/navigation";

import ArticleRenderer from "@/app/articles/components/ArticleRenderer";

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const res = await fetch(`${process.env.API_URL}/articles/by-slug/${slug}`, {
    // SSR-friendly (revalidate once in a while)
    next: { revalidate: 60 },
  });

  if (!res.ok) notFound();
  const article = await res.json();

  return (
    <article className="mx-auto py-5">
      <h1 className="text-3xl font-bold mb-2 title">{article.title}</h1>
      <ArticleRenderer content={article.content} />
    </article>
  );
}
