"use client";

import * as React from "react";
import Link from "next/link";
import { CircleCheckIcon, CircleHelpIcon, CircleIcon } from "lucide-react";

import { useIsMobile } from "@/hooks/use-mobile";
import {
  NavigationMenu,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

export function NavigationMenuDemo() {
  const isMobile = useIsMobile();

  return (
    <NavigationMenu className="py-4" viewport={isMobile}>
      <NavigationMenuList className="flex-wrap">
        <NavigationMenuLink
          asChild
          className={`${navigationMenuTriggerStyle()} bg-transparent`}
        >
          <Link href="/docs">Обо мне</Link>
        </NavigationMenuLink>
        <NavigationMenuLink
          asChild
          className={`${navigationMenuTriggerStyle()} bg-transparent`}
        >
          <Link href="/docs">Обо мне</Link>
        </NavigationMenuLink>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link href={href}>
          <div className="text-sm leading-none font-medium">{title}</div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}
