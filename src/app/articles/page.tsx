import { ArticleCard } from "./components/ArticleCard";

interface Article {
  id: string | number;
  title: string;
  description: string;
  image?: string;
  date?: string;
}

interface ArticleResponse {
  items: Article[];
  total: number;
  limit: number;
  page: number;
  totalPages: number;
  nextCursor: string;
}

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
      nextCursor: "",
    };
  }

  return res.json();
}

export default async function ArticlesPage() {
  const articles = await getArticles();

  return (
    <>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        📰 Статьи
      </h1>

      {articles.items.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">
          Статьи пока не добавлены.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.items.map((article) => (
            <ArticleCard key={article.id} {...article} />
          ))}
        </div>
      )}
    </>
  );
}
