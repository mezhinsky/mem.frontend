import Link from "next/link";

import { siteConfig } from "@/lib/config";
import { MainNav } from "@/components/main-nav";
import { MobileNav } from "@/components/mobile-nav";
// import blocks from "@/registry/__blocks__.json"
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import Logo from "./Logo";
import { SearchLauncher } from "./SearchLauncher";

export function SiteHeader() {
  return (
    <header className="bg-background sticky top-0 z-50 w-full py-4">
      <div className="container-wrapper 3xl:fixed:px-0 px-6">
        <div className="3xl:fixed:container flex h-(--header-height) items-center **:data-[slot=separator]:!h-4">
          <MobileNav items={siteConfig.navItems} className="flex lg:hidden" />
          <Button
            asChild
            variant="ghost"
            size="icon"
            className="size-11 lg:flex fill-indigo-700"
          >
            <Link href="/">
              <Icons.logo className="size-8" />
              <span className="sr-only">{siteConfig.name}</span>
            </Link>
          </Button>
          <MainNav items={siteConfig.navItems} className="hidden lg:flex" />

          <div className="ml-auto">
            <SearchLauncher />
          </div>
        </div>
      </div>
    </header>
  );
}
