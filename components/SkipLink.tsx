"use client";

import { useLanguage } from "@/lib/usePreferences";

export function SkipLink() {
  const { t } = useLanguage();
  return (
    <a className="skip-link" href="#main">
      {t.skipToContent}
    </a>
  );
}
