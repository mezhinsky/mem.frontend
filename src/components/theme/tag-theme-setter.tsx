"use client";

import { useEffect } from "react";
import { useThemeConfig } from "./active-theme";
import { getTagThemeName, hasTagTheme } from "@/config/tag-themes";

interface TagThemeSetterProps {
  /** Tag slug to apply theme for */
  tagSlug: string;
}

/**
 * Client component that sets the active theme based on tag slug.
 * Automatically resets to "default" theme when unmounted.
 *
 * Usage:
 * ```tsx
 * <TagThemeSetter tagSlug="typescript" />
 * ```
 */
export function TagThemeSetter({ tagSlug }: TagThemeSetterProps) {
  const { setActiveTheme } = useThemeConfig();

  useEffect(() => {
    const themeName = getTagThemeName(tagSlug);

    if (hasTagTheme(tagSlug)) {
      setActiveTheme(themeName);
    }

    // Reset to default theme when leaving the page
    return () => {
      setActiveTheme("default");
    };
  }, [tagSlug, setActiveTheme]);

  // This component doesn't render anything
  return null;
}
