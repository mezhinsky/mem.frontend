"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArticleCard } from "./ArticleCard";
import type { Article, ArticleAsset, ArticleResponse } from "../../../types/article";

interface ArticlesListProps {
  initialData: ArticleResponse;
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

async function fetchAsset(id: string): Promise<ArticleAsset | null> {
  if (!apiUrl) return null;
  const res = await fetch(`${apiUrl}/assets/${id}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

async function hydrateThumbnailAssets(articles: Article[]): Promise<Article[]> {
  const ids = Array.from(
    new Set(
      articles
        .map((a) => a.thumbnailAssetId)
        .filter((id): id is string => Boolean(id))
    )
  );

  const missingIds = ids.filter(
    (id) => !articles.some((a) => a.thumbnailAsset?.id === id)
  );

  if (missingIds.length === 0) return articles;

  const results = await Promise.allSettled(
    missingIds.map(async (id) => [id, await fetchAsset(id)] as const)
  );

  const map = new Map<string, ArticleAsset>();
  for (const r of results) {
    if (r.status !== "fulfilled") continue;
    const [id, asset] = r.value;
    if (asset) map.set(id, asset);
  }

  return articles.map((a) => {
    if (a.thumbnailAsset) return a;
    const id = a.thumbnailAssetId ?? null;
    if (!id) return a;
    const asset = map.get(id);
    if (!asset) return a;
    return { ...a, thumbnailAsset: asset };
  });
}

function mergeUniqueById(existing: Article[], incoming: Article[]) {
  const map = new Map<string | number, Article>();
  existing.forEach((item) => map.set(item.id, item));
  incoming.forEach((item) => {
    if (!map.has(item.id)) map.set(item.id, item);
  });
  return Array.from(map.values());
}

// Tailwind НЕ умеет генерить классы из строк вида `sm:col-span-${x}`,
// поэтому делаем статическое соответствие.
const SPAN_BY_WEIGHT: Record<number, string> = {
  1: "sm:col-span-1",
  2: "sm:col-span-2",
  3: "sm:col-span-3",
  4: "sm:col-span-4",
};

// Фикс “дырки”: широкие карточки (3-4 колонки) всегда начинаем с первой колонки.
// Тогда они не будут “упираться” в оставшиеся 1-2 ячейки строки.
const START_BY_WEIGHT: Record<number, string> = {
  3: "sm:col-start-1",
  4: "sm:col-start-1",
};

function clampWeightToCols(weight: unknown, cols = 4) {
  const n = typeof weight === "number" ? weight : Number(weight);
  if (!Number.isFinite(n)) return 1;
  return Math.min(cols, Math.max(1, Math.trunc(n)));
}

export function ArticlesList({ initialData }: ArticlesListProps) {
  const [items, setItems] = useState<Article[]>(initialData.items ?? []);
  const [nextCursor, setNextCursor] = useState<ArticleResponse["nextCursor"]>(
    initialData.nextCursor
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hydratedOnceRef = useRef(false);

  const hasMore = nextCursor !== null && nextCursor !== undefined;

  const colsOnSm = 4;

  // (Опционально) Если хочешь, чтобы крупные карточки шли раньше — включи сортировку.
  // Тогда дырки почти никогда не появляются даже без START_BY_WEIGHT.
  // Сейчас оставил выключенным (рендерим в исходном порядке).
  // const sortedItems = useMemo(() => {
  //   const copy = [...items];
  //   copy.sort(
  //     (a, b) =>
  //       clampWeightToCols(b?.weight, colsOnSm) -
  //       clampWeightToCols(a?.weight, colsOnSm)
  //   );
  //   return copy;
  // }, [items]);

  useEffect(() => {
    if (hydratedOnceRef.current) return;
    hydratedOnceRef.current = true;

    hydrateThumbnailAssets(items)
      .then((hydrated) => setItems(hydrated))
      .catch((err) => {
        console.error("Failed to hydrate thumbnails:", err);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLoadMore = async () => {
    if (!hasMore || !apiUrl || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`${apiUrl}/public/articles?cursorId=${nextCursor}`, {
        cache: "no-store",
      });

      if (!res.ok) throw new Error(res.statusText);

      const data: ArticleResponse = await res.json();
      const hydratedIncoming = await hydrateThumbnailAssets(data.items ?? []);
      setItems((prev) => mergeUniqueById(prev, hydratedIncoming));
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

  // Если включишь сортировку, замени items на sortedItems:
  // const list = sortedItems;
  const list = items;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 grid-flow-dense">
        {list.map((article) => {
          const w = clampWeightToCols(article?.weight, colsOnSm);
          const spanClass = SPAN_BY_WEIGHT[w] ?? SPAN_BY_WEIGHT[1];
          const startClass = START_BY_WEIGHT[w] ?? "";

          return (
            <ArticleCard
              key={String(article.id)}
              className={`${spanClass} ${startClass}`}
              {...article}
            />
          );
        })}
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
