import type { ElementType, ReactNode } from "react";
import { resolveText, type ContentLanguage, type Language, type TextValue } from "@/lib/i18n";

// Phone numbers, email addresses and Latin codes keep their own left-to-right order.
export function Ltr({ children }: { children: ReactNode }) {
  return <bdi dir="ltr" className="ltr">{children}</bdi>;
}

export function telHref(phone: string) {
  return `tel:+98${phone.replace(/\D/g, "").replace(/^0/, "")}`;
}

/**
 * Renders content text for the active language (see resolveText). When Arabic
 * falls back to the Persian or English original, the element is marked with that
 * language so fonts, screen readers and direction stay correct.
 */
export function LocalizedText({
  value,
  language,
  as: Tag = "span",
  className,
  arabicFallback,
}: {
  value: TextValue | undefined;
  language: Language;
  as?: ElementType;
  className?: string;
  arabicFallback?: ContentLanguage;
}) {
  const resolved = resolveText(value, language, arabicFallback);
  if (!resolved) return null;
  const foreign = resolved.lang !== language;
  return (
    <Tag className={className} lang={foreign ? resolved.lang : undefined} dir={foreign ? (resolved.lang === "en" ? "ltr" : "rtl") : undefined}>
      {resolved.text}
    </Tag>
  );
}
