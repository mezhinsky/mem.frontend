"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/config";
import { Icons } from "@/components/icons";

type IconName = keyof typeof Icons;

export function ArticlesNav() {
  const pathname = usePathname();

  return (
    <nav className="w-full bg-background overflow-x-auto scrollbar-hide">
      <div className="flex h-auto min-w-max items-center gap-1 px-4 py-2">
        {siteConfig.blogItems.map((item) => {
          const IconComponent = item.icon
            ? Icons[item.icon as IconName]
            : null;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "inline-flex items-center gap-2 whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition-colors",
                "hover:bg-accent hover:text-accent-foreground",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground"
              )}
            >
              {IconComponent && (
                <IconComponent className="h-14 w-14 shrink-0" />
              )}
              {item.label && <span>{item.label}</span>}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
