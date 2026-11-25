"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { dictionary } from "./i18n";
import { languagePreference, themePreference, viewPreference } from "./preferences";

export function useLanguage() {
  const language = useSyncExternalStore(
    languagePreference.subscribe,
    languagePreference.get,
    languagePreference.getServer
  );
  return { language, t: dictionary[language], setLanguage: languagePreference.set };
}

export function useViewMode() {
  const view = useSyncExternalStore(viewPreference.subscribe, viewPreference.get, viewPreference.getServer);
  return { view, setView: viewPreference.set };
}

export function useTheme() {
  const theme = useSyncExternalStore(themePreference.subscribe, themePreference.get, themePreference.getServer);
  return { theme, setTheme: themePreference.set };
}

// Next.js writes the English metadata title on its own schedule, which can land
// after this effect, so the title is re-applied whenever <head> changes.
export function useDocumentTitle(title: string) {
  useEffect(() => {
    const apply = () => {
      if (document.title !== title) document.title = title;
    };
    apply();
    const observer = new MutationObserver(apply);
    observer.observe(document.head, { subtree: true, childList: true, characterData: true });
    return () => observer.disconnect();
  }, [title]);
}

// The current time, known only after hydration so server and client agree on
// the first render. Event timing (upcoming, ongoing, past) is decided with it.
export function useNow() {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => setNow(Date.now()), []);
  return now;
}

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return reduced;
}
