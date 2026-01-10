import { ArticlesList } from "./components/ArticlesList";
import type { ArticleAsset, ArticleResponse } from "@/types/article";

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

  const data: ArticleResponse = await res.json();

  const ids = Array.from(
    new Set(
      (data.items ?? [])
        .map((a) => a.thumbnailAssetId)
        .filter((id): id is string => Boolean(id)),
    ),
  );

  if (ids.length === 0) return data;

  const results = await Promise.allSettled(
    ids.map(async (id) => {
      const assetRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/assets/${id}`,
        { next: { revalidate: 60 } },
      );
      if (!assetRes.ok) return [id, null] as const;
      const asset: ArticleAsset = await assetRes.json();
      return [id, asset] as const;
    }),
  );

  const map = new Map<string, ArticleAsset>();
  for (const r of results) {
    if (r.status !== "fulfilled") continue;
    const [id, asset] = r.value;
    if (asset) map.set(id, asset);
  }

  return {
    ...data,
    items: (data.items ?? []).map((a) => {
      if (a.thumbnailAsset) return a;
      const id = a.thumbnailAssetId ?? null;
      if (!id) return a;
      const asset = map.get(id);
      if (!asset) return a;
      return { ...a, thumbnailAsset: asset };
    }),
  };
}

export default async function ArticlesPage() {
  const articles = await getArticles();

  return <ArticlesList initialData={articles} />;
}
