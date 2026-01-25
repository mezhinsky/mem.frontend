export const siteConfig = {
  name: "shadcn/ui",
  url: "https://ui.shadcn.com",
  ogImage: "https://ui.shadcn.com/og.jpg",
  description:
    "A set of beautifully designed components that you can customize, extend, and build on. Start here then make it your own. Open Source. Open Code.",
  links: {
    twitter: "https://twitter.com/shadcn",
    github: "https://github.com/shadcn-ui/ui",
  },
  navItems: [
    {
      href: "/articles",
      label: "Блог",
    },
    {
      href: "/tags/res",
      label: "Реставрация 🛠",
    },
    {
      href: "/tags/dev",
      label: "DEV 🤓",
    },
    {
      href: "/tags/star-wars",
      label: "STAR WARS",
    },
  ],
  blogItems: [
    {
      href: "/tags/ww2",
      label: "WW2",
      icon: "gooseSolder" as const,
    },
    {
      href: "/tags/fantasy",
      label: "Фентази",
      icon: "gooseWizard" as const,
    },
    {
      href: "/tags/star-wars",
      label: "STAR WARS",
      icon: "gooseJedi" as const,
    },
  ],
};

export const META_THEME_COLORS = {
  light: "#ffffff",
  dark: "#09090b",
};
