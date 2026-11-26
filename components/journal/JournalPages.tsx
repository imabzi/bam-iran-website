"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { articleCategories, articles, type Article, type ArticleCategoryId } from "@/data/journal";
import { getProjectByCode, type Project } from "@/data/projects";
import { formatDate, textOf } from "@/lib/i18n";
import { useDocumentTitle, useLanguage } from "@/lib/usePreferences";
import { ArrowIcon } from "../ArrowIcon";
import { ArticleCard } from "../ArticleCard";
import { Header } from "../Header";
import { SiteFooter } from "../SiteFooter";
import { LocalizedText } from "../Text";
import { PageIntro, SectionHeading, TextLink } from "../ui";

export function ArticleDirectory() {
  const { language, t } = useLanguage();
  const [category, setCategory] = useState<"all" | ArticleCategoryId>("all");
  useDocumentTitle(`${t.journalTitle} — ${t.brand}`);

  // Only categories that actually contain articles are offered.
  const used = (Object.keys(articleCategories) as ArticleCategoryId[]).filter((id) => articles.some((article) => article.category === id));
  const list = category === "all" ? articles : articles.filter((article) => article.category === category);

  return (
    <>
      <Header />
      <main id="main" className="inner-page">
        <PageIntro title={t.journalTitle} />
        <section className="container section-tight">
          {articles.length === 0 ? (
            <p className="empty-state">{t.journalEmpty}</p>
          ) : (
            <>
              {used.length > 1 && (
                <div className="filter-bar">
                  <div className="category-filter" role="group" aria-label={t.journalFilterLabel}>
                    {(["all", ...used] as const).map((id) => (
                      <button key={id} type="button" className={id === category ? "category active" : "category"} aria-pressed={id === category} onClick={() => setCategory(id)}>
                        {id === "all" ? t.journalAll : <LocalizedText value={articleCategories[id]} language={language} />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div className="journal-grid journal-grid-archive">
                {list.map((article, index) => (
                  <ArticleCard key={article.id} article={article} priority={index === 0} />
                ))}
              </div>
            </>
          )}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

export function ArticleDetail({ article }: { article: Article }) {
  const { language, t } = useLanguage();
  const foreign = !article.title[language];
  const title = textOf(article.title, language) ?? textOf(article.title, article.language) ?? "";
  useDocumentTitle(`${title} — ${t.brand}`);
  const projects = (article.relatedProjectCodes ?? []).map(getProjectByCode).filter((project): project is Project => Boolean(project));
  const more = articles.filter((item) => item.id !== article.id).slice(0, 3);
  // The article body is shown in the language it was written in.
  const bodyLanguage = foreign ? article.language : language;

  return (
    <>
      <Header />
      <main id="main" className="inner-page">
        <article className={foreign ? "article-foreign" : undefined}>
          <header className="container article-head">
            <Link href="/journal" className="back-link">
              <ArrowIcon />
              <span>{t.journalTitle}</span>
            </Link>
            <p className="article-details">
              <LocalizedText value={articleCategories[article.category]} language={language} />
              <span className="meta-dot" aria-hidden="true" />
              <time dateTime={article.publishedAt}>{formatDate(article.publishedAt, language)}</time>
            </p>
            <h1 className="article-headline" lang={foreign ? article.language : undefined} dir={foreign ? "rtl" : undefined}>
              {title}
            </h1>
            {foreign && <p className="article-language">{t.publishedIn}</p>}
          </header>

          {article.cover && (
            <figure className="container article-cover">
              <Image
                src={article.cover.src}
                alt=""
                width={article.cover.width}
                height={article.cover.height}
                priority
                sizes={`(max-width: 760px) 100vw, ${article.cover.width}px`}
              />
            </figure>
          )}

          <div className="container">
            <div className="article-body" lang={foreign ? article.language : undefined} dir={foreign ? "rtl" : undefined}>
              {article.body.map((paragraph, index) => (
                <p key={index}>{textOf(paragraph, bodyLanguage)}</p>
              ))}
            </div>
            <div className="article-foot">
              {projects.length > 0 && (
                <div className="article-related">
                  <span className="kicker">{t.relatedProjects}</span>
                  <ul className="link-list">
                    {projects.map((project) => (
                      <li key={project.code}>
                        <TextLink href={`/projects/${project.slug}`}>{textOf(project.title, language) ?? project.title.fa}</TextLink>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {article.source && (
                <TextLink href={article.source} external>
                  {t.originalSource}
                </TextLink>
              )}
            </div>
          </div>
        </article>

        {more.length > 0 && (
          <section className="container section-tight" aria-labelledby="more-articles">
            <SectionHeading id="more-articles" title={t.moreFromJournal} />
            <div className="journal-grid">
              {more.map((item) => (
                <ArticleCard key={item.id} article={item} />
              ))}
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
