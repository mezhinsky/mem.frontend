import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";

import { ArticleRenderer } from "@/components/articles/article-renderer";
import type { ArticleAsset, JsonObject } from "@/types/article";

import { TelegramDiscussion } from "@/components/telegram-discussion";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://mezhinsky.me";

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

async function getArticle(slug: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/public/articles/${slug}`,
    { next: { revalidate: 60 } }
  );
  if (!res.ok) return null;
  return res.json();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    return {
      title: "Статья не найдена",
    };
  }

  const ogImageAsset =
    article.ogImageAsset ??
    (article.ogImageAssetId ? await getAsset(article.ogImageAssetId) : null);
  const thumbnailAsset =
    article.thumbnailAsset ??
    (article.thumbnailAssetId ? await getAsset(article.thumbnailAssetId) : null);

  const ogImageUrl = pickHeroImageUrl(ogImageAsset) || pickHeroImageUrl(thumbnailAsset);
  const description = article.description || `Читайте статью "${article.title}" на Mezhinsky.me`;

  return {
    title: article.title,
    description,
    openGraph: {
      title: article.title,
      description,
      type: "article",
      url: `${SITE_URL}/articles/${slug}`,
      publishedTime: article.createdAt,
      modifiedTime: article.updatedAt,
      authors: ["Dmitry Mezhinsky"],
      images: ogImageUrl
        ? [
            {
              url: ogImageUrl,
              width: 1200,
              height: 630,
              alt: article.title,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description,
      images: ogImageUrl ? [ogImageUrl] : [],
    },
    alternates: {
      canonical: `${SITE_URL}/articles/${slug}`,
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) notFound();

  const thumbnailAsset =
    article.thumbnailAsset ??
    (article.thumbnailAssetId
      ? await getAsset(article.thumbnailAssetId)
      : null);
  const heroUrl = pickHeroImageUrl(thumbnailAsset);

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description || `Статья "${article.title}"`,
    image: heroUrl || undefined,
    datePublished: article.createdAt,
    dateModified: article.updatedAt,
    author: {
      "@type": "Person",
      name: "Dmitry Mezhinsky",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Person",
      name: "Dmitry Mezhinsky",
      url: SITE_URL,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/articles/${slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="mx-auto flex-col space-y-4 gap-1">
        <div className="container-wrapper 3xl:fixed:px-0 px-6 py-5">
          {heroUrl && (
            <div className="relative w-full aspect-[16/9] overflow-hidden rounded-md border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 mb-6">
              <Image
                src={heroUrl}
                alt={article.title ?? "Article image"}
                fill
                priority
                unoptimized
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 800px"
              />
            </div>
          )}
          <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-gray-100">
            {article.title}
          </h1>
        </div>
        <div className="container-wrapper 3xl:fixed:px-0 px-6 py-5">
          <ArticleRenderer content={article.content} />
        </div>
        {article.tgWidget && (
          <div className="max-w-[calc(50rem+2rem)] mx-auto w-full px-6 mt-8">
            <TelegramDiscussion
              channel={article.tgWidget.channel}
              post={article.tgWidget.messageId}
              width="100%"
              dark={false}
              comments={10}
              keyId={`${article.tgWidget.channel}-${article.tgWidget.messageId}`}
            />
          </div>
        )}
      </article>
    </>
  );
}
