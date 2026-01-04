"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface ArticleCardProps {
  className: string;
  id: string | number;
  title: string;
  description: string;
  slug?: string;
  image?: string;
  date?: string;
}

export function ArticleCard({
  className,
  id,
  title,
  description,
  slug,
  image,
  date,
}: ArticleCardProps) {
  const href = `/articles/${slug ?? id}`;

  return (
    <Link href={href} className={cn("block group", className)} prefetch={false}>
      <article
        key={id}
        className="bg-white dark:bg-gray-800 rounded-md shadow-sm group-hover:shadow-md transition overflow-hidden h-full min-h-80"
      >
        {image && (
          <div className="relative w-full h-48">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover"
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
