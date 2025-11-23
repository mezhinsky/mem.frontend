"use client";

import { useState } from "react";
import { ArticleCard } from "./ArticleCard";
import type { Article, ArticleResponse } from "../types";

interface ArticlesListProps {
  initialData: ArticleResponse;
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

function mergeUniqueById(existing: Article[], incoming: Article[]) {
  const map = new Map<string | number, Article>();
  existing.forEach((item) => map.set(item.id, item));
  incoming.forEach((item) => {
    if (!map.has(item.id)) {
      map.set(item.id, item);
    }
  });
  return Array.from(map.values());
}

export function ArticlesList({ initialData }: ArticlesListProps) {
  const [items, setItems] = useState<Article[]>(initialData.items ?? []);
  const [nextCursor, setNextCursor] = useState<ArticleResponse["nextCursor"]>(
    initialData.nextCursor
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasMore = nextCursor !== null && nextCursor !== undefined;

  const handleLoadMore = async () => {
    if (!hasMore || !apiUrl) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`${apiUrl}/articles?cursorId=${nextCursor}`, {
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error(res.statusText);
      }

      const data: ArticleResponse = await res.json();
      setItems((prev) => mergeUniqueById(prev, data.items ?? []));
      setNextCursor(data.nextCursor);
    } catch (err) {
      console.error("Failed to load more articles:", err);
      setError("Не удалось загрузить ещё. Попробуйте снова.");
    } finally {
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <p className="text-gray-500 dark:text-gray-400">
        Статьи пока не добавлены.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((article) => (
          <ArticleCard key={String(article.id)} {...article} />
        ))}
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {hasMore && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={handleLoadMore}
            disabled={isLoading}
            className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 disabled:opacity-70 disabled:cursor-not-allowed dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
          >
            {isLoading ? "Загрузка..." : "Загрузить еще"}
          </button>
        </div>
      )}
    </div>
  );
}
