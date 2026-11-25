"use client";

import Image from "next/image";
import Link from "next/link";
import { articleCategories, type Article } from "@/data/journal";
import { formatDate, textOf } from "@/lib/i18n";
import { useLanguage } from "@/lib/usePreferences";
import { ArrowIcon } from "./ArrowIcon";
import { LocalizedText } from "./Text";

/**
 * `stacked`: cover above the text (journal archive and related articles).
 * `row`: an editorial list row used on the homepage — image at the start side
 * (right in Persian and Arabic), then category · date, the headline and an arrow.
 */
export function ArticleCard({ article, layout = "stacked", priority = false }: { article: Article; layout?: "stacked" | "row"; priority?: boolean }) {
  const { language, t } = useLanguage();
  const title = textOf(article.title, language) ?? textOf(article.title, article.language) ?? "";
  const foreign = article.language !== language && !article.title[language];
  const date = <time dateTime={article.publishedAt}>{formatDate(article.publishedAt, language)}</time>;
  const heading = (
    <h3 className="article-title" lang={foreign ? article.language : undefined} dir={foreign ? "rtl" : undefined}>
      {title}
    </h3>
  );
  const cover = article.cover && (
    <div className="article-media">
      <Image
        src={article.cover.src}
        alt=""
        fill
        priority={priority}
        sizes={layout === "row" ? "(max-width: 767px) 100vw, 280px" : "(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw"}
        className="article-image"
      />
    </div>
  );

  if (layout === "row") {
    return (
      <Link href={`/journal/${article.slug}`} className="article-card article-card-row">
        {cover}
        <div className="article-row-text">
          <p className="article-details">
            <LocalizedText value={articleCategories[article.category]} language={language} />
            <span className="meta-dot" aria-hidden="true" />
            {date}
          </p>
          {heading}
          {foreign && <p className="article-language">{t.publishedIn}</p>}
        </div>
        <span className="article-row-arrow" aria-hidden="true"><ArrowIcon /></span>
      </Link>
    );
  }

  return (
    <Link href={`/journal/${article.slug}`} className="article-card article-card-stacked">
      {cover}
      <div className="article-meta">
        <p className="article-details">
          <LocalizedText value={articleCategories[article.category]} language={language} />
          <span className="meta-dot" aria-hidden="true" />
          {date}
        </p>
        {heading}
        {foreign && <p className="article-language">{t.publishedIn}</p>}
      </div>
    </Link>
  );
}
