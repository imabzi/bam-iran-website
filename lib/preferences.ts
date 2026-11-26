import { defaultLanguage, languages, type Language } from "./i18n";

export const viewModes = ["visual", "index", "map"] as const;
export type ViewMode = (typeof viewModes)[number];

export const themes = ["light", "dark"] as const;
export type Theme = (typeof themes)[number];

const LANGUAGE_KEY = "bam-language";
const VIEW_KEY = "bam-view";
const THEME_KEY = "bam-theme";
export const PENDING_ATTRIBUTE = "data-preferences-pending";
export const THEME_ATTRIBUTE = "data-theme";

// A small external store over localStorage. The server always renders the
// fallback value; the client switches to the stored value during hydration.
function createPreference<T extends string>(key: string, values: readonly T[], fallback: T, clientFallback?: () => T) {
  let current: T | null = null;
  const listeners = new Set<() => void>();

  const read = (): T => {
    try {
      const stored = window.localStorage.getItem(key);
      if (values.includes(stored as T)) return stored as T;
    } catch {
      // Storage can be blocked: use the fallback.
    }
    return clientFallback ? clientFallback() : fallback;
  };

  const notify = () => listeners.forEach((listener) => listener());

  const onStorage = (event: StorageEvent) => {
    if (event.key !== key) return;
    current = read();
    notify();
  };

  return {
    get: () => (current ??= read()),
    getServer: () => fallback,
    set: (value: T) => {
      current = value;
      try {
        window.localStorage.setItem(key, value);
      } catch {
        // Storage can be blocked; the choice still applies for this visit.
      }
      notify();
    },
    subscribe: (listener: () => void) => {
      if (listeners.size === 0) window.addEventListener("storage", onStorage);
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
        if (listeners.size === 0) window.removeEventListener("storage", onStorage);
      };
    },
  };
}

// A first visit follows the operating system; an explicit choice is then kept.
const systemTheme = (): Theme => {
  try {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  } catch {
    return "light";
  }
};

export const languagePreference = createPreference<Language>(LANGUAGE_KEY, languages, defaultLanguage);
export const viewPreference = createPreference<ViewMode>(VIEW_KEY, viewModes, "visual");
export const themePreference = createPreference<Theme>(THEME_KEY, themes, "light", systemTheme);

// Runs before first paint so returning visitors never see the default language,
// view or theme flash. The theme is applied directly. Content that would change
// with the language or view stays hidden until hydration, and the timeout keeps
// the page visible even if the JavaScript bundle fails to load.
export const preferenceBootScript = `(function(){try{
var d=document.documentElement,p=null,l=localStorage.getItem(${JSON.stringify(LANGUAGE_KEY)}),t=localStorage.getItem(${JSON.stringify(THEME_KEY)});
if(t!=="light"&&t!=="dark"){t=window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}
d.setAttribute(${JSON.stringify(THEME_ATTRIBUTE)},t);d.style.colorScheme=t;
if(l==="fa"||l==="ar"){d.lang=l;d.dir="rtl";p="language"}
else{var v=localStorage.getItem(${JSON.stringify(VIEW_KEY)});if(v==="index"||v==="map"){p="view"}}
if(p){d.setAttribute(${JSON.stringify(PENDING_ATTRIBUTE)},p);setTimeout(function(){d.removeAttribute(${JSON.stringify(PENDING_ATTRIBUTE)})},3000)}
}catch(e){}})();`;
