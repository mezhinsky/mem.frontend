import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";

import { cn } from "@/lib/utils";
import { META_THEME_COLORS } from "@/lib/config";

import { ThemeProvider } from "@/components/theme/theme-provider";
import { ActiveThemeProvider } from "@/components/theme/active-theme";
import { LayoutProvider } from "@/hooks/use-layout";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mezhinsky.me",
  description: "Personal blog of Dmitry Mezhinsky",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'dark' || ((!('theme' in localStorage) || localStorage.theme === 'system') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.querySelector('meta[name="theme-color"]').setAttribute('content', '${META_THEME_COLORS.dark}')
                }
                if (localStorage.layout) {
                  document.documentElement.classList.add('layout-' + localStorage.layout)
                }
              } catch (_) {}
            `,
          }}
        />
        <meta name="theme-color" content={META_THEME_COLORS.light} />
      </head>
      <body
        className={cn(
          geistSans.variable,
          geistMono.variable,
          inter.variable,
          "antialiased min-h-screen bg-gray-50 dark:bg-gray-900",
          "group/body overscroll-none",
          "[--footer-height:calc(var(--spacing)*14)]",
          "[--header-height:calc(var(--spacing)*14)]",
          "xl:[--footer-height:calc(var(--spacing)*24)]",
        )}
      >
        <ThemeProvider>
          <LayoutProvider>
            <ActiveThemeProvider>
              <div
                data-slot="layout"
                className="bg-background relative z-10 flex min-h-svh flex-col"
              >
                <SiteHeader />
                <main className="">{children}</main>
              </div>
              <SiteFooter />
            </ActiveThemeProvider>
          </LayoutProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
