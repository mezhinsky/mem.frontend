import { ArticlesList } from "./components/ArticlesList";
import type { ArticleResponse } from "@/types/article";

async function getArticles(): Promise<ArticleResponse> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/articles`, {
    // SSR кеширование:
    next: { revalidate: 60 }, // обновление каждые 60 сек
  });

  if (!res.ok) {
    console.error("Failed to load articles:", res.statusText);
    return {
      items: [],
      total: 0,
      limit: 10,
      page: 1,
      totalPages: 0,
      nextCursor: null,
    };
  }

  return res.json();
}

export default async function ArticlesPage() {
  const articles = await getArticles();

  return <ArticlesList initialData={articles} />;
}
