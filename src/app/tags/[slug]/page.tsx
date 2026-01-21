import { notFound } from "next/navigation";
import Image from "next/image";
import { ArticleCard } from "@/components/articles/article-card";
import { TagThemeSetter } from "@/components/theme/tag-theme-setter";
import { hasTagTheme } from "@/config/tag-themes";
import type {
  Article,
  ArticleAsset,
  Tag,
  TagAsset,
  JsonObject,
} from "@/types/article";

function isJsonObject(value: unknown): value is JsonObject {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function getCoverImageUrl(asset?: TagAsset | null): string | null {
  if (!asset) return null;
  const variantsValue = asset.metadata?.variants;
  if (!isJsonObject(variantsValue)) return asset.url;
  const variants = variantsValue as JsonObject;
  // Prefer larger variants for cover images
  const lg = variants["lg"];
  const md = variants["md"];
  const original = variants["original"];
  if (typeof lg === "string") return lg;
  if (typeof md === "string") return md;
  if (typeof original === "string") return original;
  return asset.url;
}

function isExternalUrl(url: string): boolean {
  // S3/MinIO URLs should be served unoptimized
  return url.startsWith("http://") || url.startsWith("https://");
}

interface TagWithArticles extends Tag {
  articles?: Article[];
}

async function getTag(slug: string): Promise<Tag | null> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/tags/by-slug/${slug}`,
    { next: { revalidate: 60 } },
  );

  if (!res.ok) return null;
  return res.json();
}

async function getArticlesByTag(slug: string): Promise<Article[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/tags/by-slug/${slug}/articles/public`,
    { next: { revalidate: 60 } },
  );

  if (!res.ok) return [];

  const articles: Article[] = await res.json();

  // Hydrate thumbnail assets
  const ids = Array.from(
    new Set(
      articles
        .map((a) => a.thumbnailAssetId)
        .filter((id): id is string => Boolean(id)),
    ),
  );

  if (ids.length === 0) return articles;

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

  return articles.map((a) => {
    if (a.thumbnailAsset) return a;
    const id = a.thumbnailAssetId ?? null;
    if (!id) return a;
    const asset = map.get(id);
    if (!asset) return a;
    return { ...a, thumbnailAsset: asset };
  });
}

const SPAN_BY_WEIGHT: Record<number, string> = {
  1: "sm:col-span-1",
  2: "sm:col-span-2",
  3: "sm:col-span-3",
  4: "sm:col-span-4",
};

const START_BY_WEIGHT: Record<number, string> = {
  3: "sm:col-start-1",
  4: "sm:col-start-1",
};

function clampWeightToCols(weight: unknown, cols = 4) {
  const n = typeof weight === "number" ? weight : Number(weight);
  if (!Number.isFinite(n)) return 1;
  return Math.min(cols, Math.max(1, Math.trunc(n)));
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [tag, articles] = await Promise.all([
    getTag(slug),
    getArticlesByTag(slug),
  ]);

  if (!tag) {
    notFound();
  }

  const isThemed = hasTagTheme(slug);
  const coverUrl = getCoverImageUrl(tag.coverAsset);

  return (
    <>
      <TagThemeSetter tagSlug={slug} />
      <div className="space-y-6">
        {coverUrl && (
          <div className="relative h-48 sm:h-64 rounded-xl overflow-hidden">
            <Image
              src={coverUrl}
              alt={tag.name}
              fill
              className="object-cover"
              priority
              unoptimized={isExternalUrl(coverUrl)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6">
              <span
                className={
                  isThemed
                    ? "tag-badge-themed inline-flex items-center px-3 py-1 text-sm font-medium rounded-full"
                    : "inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-white/90 text-gray-800"
                }
              >
                {tag.name}
              </span>
              <h1 className="mt-2 text-2xl sm:text-3xl font-bold text-white drop-shadow-lg">
                Статьи с тегом &laquo;{tag.name}&raquo;
              </h1>
              <p className="mt-1 text-sm text-white/80">
                {articles.length}{" "}
                {articles.length === 1
                  ? "статья"
                  : articles.length >= 2 && articles.length <= 4
                    ? "статьи"
                    : "статей"}
              </p>
            </div>
          </div>
        )}

        {!coverUrl && (
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span
                className={
                  isThemed
                    ? "tag-badge-themed inline-flex items-center px-3 py-1 text-sm font-medium rounded-full"
                    : "inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300"
                }
              >
                {tag.name}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {articles.length}{" "}
                {articles.length === 1
                  ? "статья"
                  : articles.length >= 2 && articles.length <= 4
                    ? "статьи"
                    : "статей"}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Статьи с тегом &laquo;{tag.name}&raquo;
            </h1>
          </div>
        )}

        {articles.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">
            Статьи с этим тегом пока не добавлены.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 grid-flow-dense">
            {articles.map((article) => {
              const w = clampWeightToCols(article?.weight, 4);
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
        )}
      </div>
    </>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tag = await getTag(slug);

  if (!tag) {
    return {
      title: "Тег не найден",
    };
  }

  return {
    title: `${tag.name} - Статьи`,
    description: `Все статьи с тегом "${tag.name}"`,
  };
}
