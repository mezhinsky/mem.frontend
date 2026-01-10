"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import type { ArticleAsset, JsonObject } from "@/types/article";

interface ArticleCardProps {
  className: string;
  id: string | number;
  title: string;
  description: string;
  slug?: string;
  image?: string;
  thumbnailAsset?: ArticleAsset | null;
  date?: string;
}

function pickThumbnailUrl(asset?: ArticleAsset | null): string | null {
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

  const thumb = variants?.thumb;
  const md = variants?.md;
  const original = variants?.original;

  return (
    (typeof thumb === "string" && thumb) ||
    (typeof md === "string" && md) ||
    (typeof original === "string" && original) ||
    asset.url
  );
}

export function ArticleCard({
  className,
  id,
  title,
  description,
  slug,
  image,
  thumbnailAsset,
  date,
}: ArticleCardProps) {
  const href = `/articles/${slug ?? id}`;
  const resolvedImage = image ?? pickThumbnailUrl(thumbnailAsset);

  return (
    <Link href={href} className={cn("block group", className)} prefetch={false}>
      <article
        key={id}
        className="bg-white dark:bg-gray-800 rounded-md shadow-sm group-hover:shadow-md transition overflow-hidden h-full min-h-80"
      >
        {resolvedImage && (
          <div className="relative w-full h-48">
            <Image
              src={resolvedImage}
              alt={title}
              fill
              className="object-cover"
              unoptimized
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
        )}
        <div className="p-4 flex flex-col h-full">
          <h2 className="article-card-title text-lg font-semibold mb-2 text-gray-500 dark:text-gray-100 group-hover:text-gray-600 dark:group-hover:text-blue-400 transition-colors">
            {title}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-3">
            {description}
          </p>
          {date && (
            <p className="text-xs text-gray-400 mt-auto">
              {new Date(date).toLocaleDateString()}
            </p>
          )}
        </div>
      </article>
    </Link>
  );
}
