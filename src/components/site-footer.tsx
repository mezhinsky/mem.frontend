import Link from "next/link";
import { siteConfig } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
const footerNav = [
  {
    title: "Навигация",
    links: [
      { label: "Главная", href: "/" },
      { label: "Статьи", href: "/articles" },
      { label: "Обо мне", href: "/docs" },
    ],
  },
  {
    title: "Проекты",
    links: [
      {
        label: "mem.frontend",
        href: "https://github.com/mezhinsky/MosEisleyModels/tree/main/mem.frontend",
        external: true,
      },
      {
        label: "mem.backend",
        href: "https://github.com/mezhinsky/MosEisleyModels/tree/main/mem.backend",
        external: true,
      },
      {
        label: "mem.admin",
        href: "https://github.com/mezhinsky/MosEisleyModels/tree/main/mem.admin",
        external: true,
      },
    ],
  },
  {
    title: "Контакты",
    links: [
      { label: "Telegram", href: "https://t.me/mezhinsky", external: true },
      { label: "Email", href: "mailto:hello@mezhinsky.dev" },
      { label: "Github", href: "https://github.com/mezhinsky", external: true },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="py-8 border-t border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-gray-900/60 backdrop-blur">
      <div className="container-wrapper 3xl:fixed:px-0 px-6 mx-auto grid gap-8 md:grid-cols-[1.2fr_1fr_1fr_1fr] items-start">
        <div className="space-y-3">
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
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Наблюдения, практики и эксперименты из разработки и продакшена.
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500">
            © {new Date().getFullYear()} mezhinsky
          </p>
        </div>

        {footerNav.map((section) => (
          <div key={section.title} className="space-y-3">
            <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {section.title}
            </div>
            <ul className="space-y-2">
              {section.links.map((link) => (
                <li key={`${section.title}-${link.label}`}>
                  <Link
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noreferrer" : undefined}
                    className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </footer>
  );
}
