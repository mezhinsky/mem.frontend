import Link from "next/link";

import { siteConfig } from "@/lib/config";
import { MainNav } from "@/components/main-nav";
import { MobileNav } from "@/components/mobile-nav";
import { SiteConfig } from "@/components/site-config";
import { ModeSwitcher } from "@/components/mode-switcher";

import { Icons } from "@/components/icons";
import { SearchLauncher } from "./SearchLauncher";
import { Separator } from "@/components/ui/separator";

export function SiteHeader() {
  return (
    <header className="bg-background sticky top-0 z-50 w-full py-2">
      <div className="container-wrapper 3xl:fixed:px-0 px-6">
        <div className="3xl:fixed:container flex h-(--header-height) items-center **:data-[slot=separator]:h-4!">
          <MobileNav items={siteConfig.navItems} className="flex lg:hidden" />
          <Link href="/" className="flex items-center space-x-1">
            <Icons.gooseConfused className="goose gooseConfused" />
            <Icons.mezhinsky className="mezhinsky" />
          </Link>
          <MainNav
            items={siteConfig.navItems}
            className="hidden lg:flex ml-2"
          />
          <div className="ml-auto flex items-center gap-2 md:flex-1 md:justify-end">
            <div className="w-full flex-1 md:flex md:w-auto md:flex-none">
              <SearchLauncher />
            </div>

            <SiteConfig className="3xl:flex hidden" />
            <Separator orientation="vertical" className="3xl:flex hidden" />

            <ModeSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
}
