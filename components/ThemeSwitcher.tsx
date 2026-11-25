"use client";

import { useLanguage, useTheme } from "@/lib/usePreferences";
import { MoonIcon, SunIcon } from "./Icons";

export function ThemeSwitcher({ showLabel = false }: { showLabel?: boolean }) {
  const { t } = useLanguage();
  const { theme, setTheme } = useTheme();
  const next = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      className="theme-switcher"
      aria-label={next === "dark" ? t.themeToDark : t.themeToLight}
      title={next === "dark" ? t.themeToDark : t.themeToLight}
      onClick={() => setTheme(next)}
    >
      {/* Both icons render; CSS shows the one for the theme on <html>, so the
          right icon appears before hydration too. */}
      <span className="theme-icon theme-icon-to-dark"><MoonIcon /></span>
      <span className="theme-icon theme-icon-to-light"><SunIcon /></span>
      {showLabel && <span className="theme-switcher-label">{next === "dark" ? t.themeDark : t.themeLight}</span>}
    </button>
  );
}
