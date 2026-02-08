"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, Terminal, Code, Sparkles, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const iconMap: Record<string, LucideIcon> = {
  FileText,
  Terminal,
  Code,
  Sparkles,
};

export function MainNav({
  items,
  className,
  ...props
}: React.ComponentProps<"nav"> & {
  items: { href: string; label: string; icon?: string }[];
}) {
  const pathname = usePathname();

  return (
    <nav className={cn("items-center gap-0", className)} {...props}>
      {items.map((item) => {
        const Icon = item.icon ? iconMap[item.icon] : null;
        return (
          <Button
            key={item.href}
            variant="ghost"
            asChild
            size="sm"
            className="px-2.5"
          >
            <Link
              href={item.href}
              data-active={pathname === item.href}
              className="relative items-center gap-1.5"
            >
              {Icon && <Icon className="w-4 h-4" />}
              {item.label}
            </Link>
          </Button>
        );
      })}
    </nav>
  );
}
