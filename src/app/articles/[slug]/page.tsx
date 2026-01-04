import { notFound } from "next/navigation";

import ArticleRenderer from "@/app/articles/components/ArticleRenderer";

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/articles/by-slug/${slug}`,
    {
      // SSR-friendly (revalidate once in a while)
      next: { revalidate: 60 },
    }
  );

  if (!res.ok) notFound();
  const article = await res.json();

  return (
    <article className="mx-auto flex-col space-y-4 gap-1">
      <div className="bg-yellow-100 border-t py-10">
        <div className="max-w-[calc(50rem+2rem)] mx-auto w-full px-2">
          <h1 className="text-3xl font-bold mb-2 title">{article.title}</h1>
        </div>
      </div>
      <div className="max-w-[calc(50rem+2rem)] mx-auto w-full px-2">
        <ArticleRenderer content={article.content} />
      </div>
    </article>
  );
}
