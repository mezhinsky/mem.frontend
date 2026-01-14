"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import type { ArticleAsset, JsonObject } from "@/types/article";

interface ArticleCardProps {
  className?: string;
  id: string | number;
  title: string;
  description?: string | null;
  slug?: string | null;
  image?: string;
  thumbnailAsset?: ArticleAsset | null;
  createdAt?: string;
  updatedAt?: string;
  /** @deprecated use createdAt */
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

function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours === 0) {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      if (diffMinutes < 1) return "только что";
      return `${diffMinutes} мин. назад`;
    }
    return `${diffHours} ч. назад`;
  }

  if (diffDays === 1) return "вчера";
  if (diffDays < 7) return `${diffDays} дн. назад`;
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} нед. назад`;
  }
  if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `${months} мес. назад`;
  }

  return date.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatFullDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ArticleCard({
  className,
  id,
  title,
  description,
  slug,
  image,
  thumbnailAsset,
  createdAt,
  updatedAt,
  date,
}: ArticleCardProps) {
  const href = `/articles/${slug ?? id}`;
  const resolvedImage = image ?? pickThumbnailUrl(thumbnailAsset);
  const displayDate = createdAt ?? date;
  const wasUpdated =
    updatedAt && createdAt && new Date(updatedAt) > new Date(createdAt);

  return (
    <Link href={href} className={cn("block group", className)} prefetch={false}>
      <article className="bg-white dark:bg-gray-800 rounded-lg shadow-sm group-hover:shadow-md transition-shadow overflow-hidden h-full flex flex-col">
        <div className="relative w-full aspect-[16/10] bg-gray-100 dark:bg-gray-700">
          {resolvedImage ? (
            <Image
              src={resolvedImage}
              alt={title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              unoptimized
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                className="w-12 h-12 text-gray-300 dark:text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
        </div>

        <div className="p-4 flex flex-col flex-1">
          <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
            {title}
          </h2>

          {description && (
            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 flex-1">
              {description}
            </p>
          )}

          {displayDate && (
            <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <time
                dateTime={displayDate}
                title={formatFullDate(displayDate)}
                className="cursor-help"
              >
                {formatRelativeDate(displayDate)}
              </time>
              {wasUpdated && (
                <span
                  title={`Обновлено: ${formatFullDate(updatedAt)}`}
                  className="cursor-help text-gray-400 dark:text-gray-500"
                >
                  (ред.)
                </span>
              )}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}
