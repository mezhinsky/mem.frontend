"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/config";
import { Button } from "@/components/ui/button";

export function ArticlesNav() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-16 z-40 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-12 items-center">
        <div className="flex gap-1 overflow-x-auto scrollbar-hide">
          {siteConfig.navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/articles" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-colors",
                  "hover:bg-accent hover:text-accent-foreground",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
