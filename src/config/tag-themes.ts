/**
 * Tag-based theme configuration
 * Maps tag slugs to theme names used in CSS classes (theme-{name})
 */

export interface TagTheme {
  /** Theme name used in CSS class (theme-{name}) */
  name: string;
  /** Display label for UI if needed */
  label?: string;
  /** Primary hue in oklch (0-360) for reference */
  hue?: number;
}

/**
 * Map of tag slugs to their themes
 * Add your tags here with their corresponding theme names
 */
export const TAG_THEMES: Record<string, TagTheme> = {
  // Development
  typescript: {
    name: "typescript",
    label: "TypeScript",
    hue: 250, // blue
  },
  javascript: {
    name: "javascript",
    label: "JavaScript",
    hue: 55, // yellow
  },
  react: {
    name: "react",
    label: "React",
    hue: 200, // cyan
  },
  nextjs: {
    name: "nextjs",
    label: "Next.js",
    hue: 0, // neutral/dark
  },
  nodejs: {
    name: "nodejs",
    label: "Node.js",
    hue: 145, // green
  },

  // DevOps & Infrastructure
  devops: {
    name: "devops",
    label: "DevOps",
    hue: 145, // green
  },
  docker: {
    name: "docker",
    label: "Docker",
    hue: 210, // docker blue
  },
  kubernetes: {
    name: "kubernetes",
    label: "Kubernetes",
    hue: 220, // k8s blue
  },

  // AI & ML
  ai: {
    name: "ai",
    label: "AI",
    hue: 300, // purple
  },
  "machine-learning": {
    name: "ai",
    label: "Machine Learning",
    hue: 300,
  },

  // Other topics
  design: {
    name: "design",
    label: "Design",
    hue: 330, // pink
  },
  security: {
    name: "security",
    label: "Security",
    hue: 25, // orange
  },
  database: {
    name: "database",
    label: "Database",
    hue: 180, // teal
  },
};

/**
 * Get theme for a tag by its slug
 * Returns null if no theme is configured for the tag
 */
export function getTagTheme(slug: string): TagTheme | null {
  return TAG_THEMES[slug.toLowerCase()] ?? null;
}

/**
 * Get theme name for CSS class
 * Returns "default" if no theme is configured
 */
export function getTagThemeName(slug: string): string {
  return TAG_THEMES[slug.toLowerCase()]?.name ?? "default";
}

/**
 * Check if a tag has a custom theme
 */
export function hasTagTheme(slug: string): boolean {
  return slug.toLowerCase() in TAG_THEMES;
}
