"use client";

import { useEffect } from "react";
import { directionOf } from "@/lib/i18n";
import { languagePreference, PENDING_ATTRIBUTE, themePreference, THEME_ATTRIBUTE } from "@/lib/preferences";
import { useLanguage, useTheme } from "@/lib/usePreferences";

// Keeps <html lang dir data-theme> in step with the selected language and theme,
// and reveals content held back by the boot script once hydration has applied
// the stored preferences.
export function DocumentPreferences() {
  const { language } = useLanguage();
  const { theme } = useTheme();

  useEffect(() => {
    // Read from the store: the first render still holds the server snapshot.
    const current = languagePreference.get();
    const root = document.documentElement;
    root.lang = current;
    root.dir = directionOf(current);
    const frame = requestAnimationFrame(() => root.removeAttribute(PENDING_ATTRIBUTE));
    return () => cancelAnimationFrame(frame);
  }, [language]);

  useEffect(() => {
    const current = themePreference.get();
    const root = document.documentElement;
    root.setAttribute(THEME_ATTRIBUTE, current);
    root.style.colorScheme = current;
  }, [theme]);

  return null;
}
