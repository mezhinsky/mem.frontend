import { notFound } from "next/navigation";
import Image from "next/image";
import { TagArticleList } from "@/components/articles/tag-article-list";
import { TagThemeSetter } from "@/components/theme/tag-theme-setter";
import { hasTagTheme } from "@/config/tag-themes";
import type {
  ArticleAsset,
  ArticleResponse,
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

async function getTag(slug: string): Promise<Tag | null> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/tags/by-slug/${slug}`,
    { next: { revalidate: 60 } },
  );

  if (!res.ok) return null;
  return res.json();
}

async function getArticlesByTag(slug: string): Promise<ArticleResponse> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/tags/by-slug/${slug}/articles/public?limit=10`,
    { next: { revalidate: 60 } },
  );

  if (!res.ok) return { items: [], total: 0, limit: 10, nextCursor: null };

  const data: ArticleResponse = await res.json();
  const articles = data.items ?? [];

  // Hydrate thumbnail assets
  const ids = Array.from(
    new Set(
      articles
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

  const hydratedItems = articles.map((a) => {
    if (a.thumbnailAsset) return a;
    const id = a.thumbnailAssetId ?? null;
    if (!id) return a;
    const asset = map.get(id);
    if (!asset) return a;
    return { ...a, thumbnailAsset: asset };
  });

  return { ...data, items: hydratedItems };
}

function pluralizeArticles(count: number): string {
  if (count === 1) return "статья";
  if (count >= 2 && count <= 4) return "статьи";
  return "статей";
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [tag, articlesData] = await Promise.all([
    getTag(slug),
    getArticlesByTag(slug),
  ]);

  if (!tag) {
    notFound();
  }

  const isThemed = hasTagTheme(slug);
  const coverUrl = getCoverImageUrl(tag.coverAsset);
  const totalArticles = articlesData.total;

  return (
    <>
      <TagThemeSetter tagSlug={slug} />
      <div className="space-y-6">
        {coverUrl && (
          <div className="container-wrapper 3xl:fixed:px-0">
            <div className="relative h-48 sm:h-64 3xl:rounded-xl overflow-hidden">
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
                  {totalArticles} {pluralizeArticles(totalArticles)}
                </p>
              </div>
            </div>
          </div>
        )}

        {!coverUrl && (
          <div className="container-wrapper px-6 3xl:fixed:px-0">
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
                {totalArticles} {pluralizeArticles(totalArticles)}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Статьи с тегом &laquo;{tag.name}&raquo;
            </h1>
          </div>
        )}
        <div className="container-wrapper 3xl:fixed:px-0 px-6 py-5">
          <TagArticleList tagSlug={slug} initialData={articlesData} />
        </div>
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
