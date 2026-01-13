import { notFound } from "next/navigation";
import Image from "next/image";

import ArticleRenderer from "@/app/articles/components/ArticleRenderer";
import type { ArticleAsset, JsonObject } from "@/types/article";

function pickHeroImageUrl(asset?: ArticleAsset | null): string | null {
  if (!asset) return null;

  const metadata = asset.metadata;
  const variantsValue =
    metadata && typeof metadata === "object" && !Array.isArray(metadata)
      ? (metadata as JsonObject).variants
      : null;

  const variants =
    variantsValue &&
    typeof variantsValue === "object" &&
    !Array.isArray(variantsValue)
      ? (variantsValue as JsonObject)
      : null;

  const lg = variants?.lg;
  const md = variants?.md;
  const original = variants?.original;

  return (
    (typeof lg === "string" && lg) ||
    (typeof md === "string" && md) ||
    (typeof original === "string" && original) ||
    asset.url
  );
}

async function getAsset(id: string): Promise<ArticleAsset | null> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/assets/${id}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/public/articles/${slug}`,
    {
      // SSR-friendly (revalidate once in a while)
      next: { revalidate: 60 },
    }
  );

  if (!res.ok) notFound();
  const article = await res.json();
  const thumbnailAsset =
    article?.thumbnailAsset ??
    (article?.thumbnailAssetId
      ? await getAsset(article.thumbnailAssetId)
      : null);
  const heroUrl = pickHeroImageUrl(thumbnailAsset);

  return (
    <article className="mx-auto flex-col space-y-4 gap-1">
      <div className="max-w-[calc(50rem+2rem)] mx-auto w-full px-2">
        {heroUrl && (
          <div className="relative w-full aspect-[16/9] overflow-hidden rounded-md border bg-white mb-6">
            <Image
              src={heroUrl}
              alt={article?.title ?? "Article image"}
              fill
              priority
              unoptimized
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 800px"
            />
          </div>
        )}
        <h1 className="text-3xl font-bold mb-2 title">{article.title}</h1>
      </div>
      <div className="max-w-[calc(50rem+2rem)] mx-auto w-full px-2">
        <ArticleRenderer content={article.content} />
      </div>
    </article>
  );
}
