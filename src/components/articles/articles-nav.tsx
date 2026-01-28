"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/config";

export function ArticlesNav() {
  const pathname = usePathname();
  const navRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    const nav = navRef.current;
    if (!nav) return;

    const { scrollLeft, scrollWidth, clientWidth } = nav;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
  };

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    checkScroll();

    nav.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);

    return () => {
      nav.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  return (
    <div className="container-wrapper 3xl:fixed:px-0 mb-3">
      <div className="relative">
        {/* Левый градиент */}
        <div
          className={cn(
            "absolute left-0 top-0 bottom-0 w-12 z-10 pointer-events-none transition-opacity duration-300",
            "bg-gradient-to-r from-background to-transparent",
            canScrollLeft ? "opacity-100" : "opacity-0"
          )}
        />

        {/* Правый градиент */}
        <div
          className={cn(
            "absolute right-0 top-0 bottom-0 w-12 z-10 pointer-events-none transition-opacity duration-300",
            "bg-gradient-to-l from-background to-transparent",
            canScrollRight ? "opacity-100" : "opacity-0"
          )}
        />

        <nav
          ref={navRef}
          className="w-full bg-background overflow-x-auto scrollbar-hide"
        >
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
    </div>
  );
}
