"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/config";

export function ArticlesNav() {
  const pathname = usePathname();

  return (
    <div className="container-wrapper 3xl:fixed:px-0 mb-3">
      <nav className="w-full bg-background overflow-x-auto scrollbar-hide">
        <div className="flex h-auto min-w-max items-center gap-1">
          {siteConfig.blogItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "inline-flex flex-col items-center justify-end gap-1 whitespace-nowrap rounded-md p-2 text-sm font-medium transition-colors",
                  "h-34 w-24",
                  "hover:bg-accent hover:text-accent-foreground",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground",
                )}
              >
                {item.image && (
                  <Image
                    src={item.image}
                    alt={item.label}
                    width={item.imageWidth ?? 56}
                    height={item.imageHeight ?? 56}
                    className="object-contain"
                  />
                )}
                {item.label && <span className="text-xs">{item.label}</span>}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
