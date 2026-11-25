"use client";

import { Fragment } from "react";
import { languageCodes, languageNames, languages } from "@/lib/i18n";
import { useLanguage } from "@/lib/usePreferences";

// `compact` shows EN / FA / AR; the full variant shows each language's own name.
export function LanguageSwitcher({ variant = "compact" }: { variant?: "compact" | "full" }) {
  const { language, setLanguage, t } = useLanguage();

  // dir="ltr" keeps EN / FA / AR in the same order in every language.
  return (
    <div
      className={variant === "full" ? "language-switcher language-switcher-full" : "language-switcher"}
      role="group"
      aria-label={t.languageLabel}
      dir={variant === "full" ? undefined : "ltr"}
    >
      {languages.map((item, index) => (
        <Fragment key={item}>
          {variant === "compact" && index > 0 && <span className="language-divider" aria-hidden="true">/</span>}
          <button
            type="button"
            className={item === language ? "language-option active" : "language-option"}
            lang={item}
            aria-pressed={item === language}
            aria-label={variant === "compact" ? languageNames[item] : undefined}
            onClick={() => setLanguage(item)}
          >
            {variant === "compact" ? languageCodes[item] : languageNames[item]}
          </button>
        </Fragment>
      ))}
    </div>
  );
}
