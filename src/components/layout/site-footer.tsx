import Link from "next/link";
import { Send, Mail, Github } from "lucide-react";
import { Icons } from "@/components/icons";

const navLinks = [
  { label: "Главная", href: "/" },
  { label: "Статьи", href: "/articles" },
  { label: "Резюме", href: "/resume" },
];

const contactLinks = [
  {
    label: "Telegram",
    href: "https://t.me/mezhinsky",
    external: true,
    icon: Send,
  },
  {
    label: "Email",
    href: "mailto:mezhinsky.dmitry@gmail.com",
    icon: Mail,
  },
  {
    label: "GitHub",
    href: "https://github.com/mezhinsky",
    external: true,
    icon: Github,
  },
];

export function SiteFooter() {
  return (
    <footer className="py-8 border-t">
      <div className="container-wrapper 3xl:fixed:px-0 px-6 mx-auto grid gap-6 md:grid-cols-[1.5fr_1fr_1fr] items-start">
        <div className="space-y-3">
          <Link href="/">
            <Icons.mezhinsky className="mezhinsky" />
          </Link>
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} mezhinsky
          </p>
        </div>

        <div className="space-y-3">
          <div className="text-sm font-semibold">Навигация</div>
          <ul className="space-y-2">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className="text-sm hover:underline">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3">
          <div className="text-sm font-semibold">Контакты</div>
          <ul className="space-y-2">
            {contactLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noreferrer" : undefined}
                  className="text-sm hover:underline inline-flex items-center gap-2"
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
