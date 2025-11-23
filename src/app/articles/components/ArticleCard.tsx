"use client";

import Image from "next/image";

interface ArticleCardProps {
  id: string | number;
  title: string;
  description: string;
  image?: string;
  date?: string;
}

export function ArticleCard({
  id,
  title,
  description,
  image,
  date,
}: ArticleCardProps) {
  return (
    <article
      key={id}
      className="bg-white dark:bg-gray-800 rounded-md shadow-sm hover:shadow-md transition overflow-hidden"
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
        <h2 className="article-card-title text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100 ">
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
  );
}
