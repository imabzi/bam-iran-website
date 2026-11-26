"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type FocusEvent, type TouchEvent } from "react";
import { demoJournalArticles } from "@/data/demo/journal";
import { articleCategories, articles } from "@/data/journal";
import { demoContent } from "@/lib/demo";
import { directionOf, formatDate, formatNumber, resolveText, type ContentLanguage, type TextValue } from "@/lib/i18n";
import { useLanguage, usePrefersReducedMotion } from "@/lib/usePreferences";
import { ChevronIcon } from "../Icons";
import { DemoBadge, TextLink } from "../ui";

export const JOURNAL_SLIDE_INTERVAL = 3000; // ms between automatic slide changes
const SWIPE_DISTANCE = 40;

export type JournalSlide = {
  id: string;
  title: TextValue;
  summary?: TextValue;
  category: TextValue;
  publishedAt: string;
  cover?: { src: string; position?: string };
  href?: string; // Only real articles have a detail page.
  sourceLanguage?: ContentLanguage; // The language a real article was written in.
  demo: boolean;
};

const SLIDE_LIMIT = 5;

/**
 * The homepage Journal selection. While demonstration content is on
 * (lib/demo.ts), the five labelled sample articles; otherwise the latest real
 * articles. Sample articles have no detail page, so they carry no link.
 */
export function homepageJournalSlides(): JournalSlide[] {
  if (demoContent.journal) {
    return demoJournalArticles.slice(0, SLIDE_LIMIT).map((article) => ({
      id: article.id,
      title: article.title,
      summary: article.summary,
      category: article.category,
      publishedAt: article.publishedAt,
      cover: article.cover,
      demo: true,
    }));
  }
  return articles.slice(0, SLIDE_LIMIT).map((article) => ({
    id: article.id,
    title: article.title,
    summary: article.body[0],
    category: articleCategories[article.category],
    publishedAt: article.publishedAt,
    cover: article.cover,
    href: `/journal/${article.slug}`,
    sourceLanguage: article.language,
    demo: false,
  }));
}

/**
 * An editorial slider showing one article at a time: a large image (right in
 * Persian and Arabic, left in English) beside category, date, headline and a
 * short description. A single `active` index drives image and text, so they
 * always change together.
 *
 * Autoplay advances every JOURNAL_SLIDE_INTERVAL ms and pauses while the
 * pointer is over the slider, keyboard focus is inside it, the tab is hidden,
 * or the visitor has paused it. With reduced motion it starts paused and
 * changes without transitions. Previous/Next change the article at once and
 * restart the timer.
 */
export function JournalSlider({ slides }: { slides: JournalSlide[] }) {
  const { language, t } = useLanguage();
  const reducedMotion = usePrefersReducedMotion();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [focused, setFocused] = useState(false);
  const [tabHidden, setTabHidden] = useState(false);
  const [touching, setTouching] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const count = slides.length;
  const running = count > 1 && !paused && !hovering && !focused && !tabHidden && !touching;

  useEffect(() => {
    if (reducedMotion) setPaused(true);
  }, [reducedMotion]);

  useEffect(() => {
    const update = () => setTabHidden(document.visibilityState === "hidden");
    update();
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  // Re-armed on every change of slide, so a manual change restarts the interval.
  useEffect(() => {
    if (!running) return;
    const timer = setTimeout(() => setActive((current) => (current + 1) % count), JOURNAL_SLIDE_INTERVAL);
    return () => clearTimeout(timer);
  }, [active, running, count]);

  if (count === 0) return null;

  const go = (step: 1 | -1) => setActive((current) => (current + step + count) % count);
  const twoDigits = (value: number) => formatNumber(value, language, { minimumIntegerDigits: 2 });

  function onFocus(event: FocusEvent<HTMLDivElement>) {
    // Keyboard focus only: a mouse click on a control should not hold autoplay.
    if (event.target.matches(":focus-visible")) setFocused(true);
  }

  function onBlur(event: FocusEvent<HTMLDivElement>) {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false);
  }

  function onTouchStart(event: TouchEvent) {
    touchStartX.current = event.touches[0].clientX;
    setTouching(true);
  }

  function onTouchEnd(event: TouchEvent) {
    setTouching(false);
    if (touchStartX.current === null) return;
    const distance = event.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(distance) < SWIPE_DISTANCE) return;
    // Swiping against the reading direction moves forward.
    go((directionOf(language) === "rtl" ? distance > 0 : distance < 0) ? 1 : -1);
  }

  return (
    <div
      className="journal-slider"
      role="region"
      aria-roledescription="carousel"
      aria-label={t.journalSliderLabel}
      onPointerEnter={(event) => { if (event.pointerType === "mouse") setHovering(true); }}
      onPointerLeave={() => setHovering(false)}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      <div
        className="journal-slider-media"
        onTouchStart={count > 1 ? onTouchStart : undefined}
        onTouchEnd={count > 1 ? onTouchEnd : undefined}
        onTouchCancel={() => setTouching(false)}
      >
        {slides.map((slide, index) => (
          <div key={slide.id} className={index === active ? "journal-slide-image active" : "journal-slide-image"} aria-hidden="true">
            {slide.cover && (
              <Image
                src={slide.cover.src}
                alt=""
                fill
                sizes="(max-width: 900px) 100vw, (max-width: 1760px) 52vw, 900px"
                className="journal-image"
                style={slide.cover.position ? { objectPosition: slide.cover.position } : undefined}
                draggable={false}
              />
            )}
          </div>
        ))}
      </div>

      <div className="journal-slider-body">
        <div className="journal-slider-texts" aria-live={running ? "off" : "polite"}>
          {slides.map((slide, index) => {
            const current = index === active;
            const title = resolveText(slide.title, language) ?? (slide.sourceLanguage && resolveText(slide.title, slide.sourceLanguage));
            const summary = resolveText(slide.summary, language) ?? (slide.sourceLanguage && resolveText(slide.summary, slide.sourceLanguage));
            const category = resolveText(slide.category, language);
            const foreign = Boolean(title && title.lang !== language);
            const marks = (lang: string) => (lang !== language ? { lang, dir: lang === "en" ? "ltr" : "rtl" } : {});
            return (
              <div
                key={slide.id}
                className={current ? "journal-slide active" : "journal-slide"}
                role="group"
                aria-roledescription="slide"
                aria-label={t.journalSlideLabel(formatNumber(index + 1, language), formatNumber(count, language))}
                aria-hidden={!current}
                inert={!current}
              >
                <p className="journal-slide-meta">
                  {category && <span {...marks(category.lang)}>{category.text}</span>}
                  {category && <span className="meta-dot" aria-hidden="true" />}
                  <time dateTime={slide.publishedAt}>{formatDate(slide.publishedAt, language)}</time>
                  {slide.demo && <DemoBadge label={t.demoBadge} title={t.journalDemoNote} />}
                </p>
                {title && <h3 className="journal-slide-title" {...marks(title.lang)}>{title.text}</h3>}
                {summary && <p className="journal-slide-summary" {...marks(summary.lang)}>{summary.text}</p>}
                {foreign && <p className="article-language">{t.publishedIn}</p>}
                {slide.href && <TextLink href={slide.href} className="journal-slide-link">{t.readArticle}</TextLink>}
              </div>
            );
          })}
        </div>

        {count > 1 && (
          <div className="journal-slider-controls">
            <p className="journal-counter" aria-hidden="true">
              <span className="journal-counter-current">{twoDigits(active + 1)}</span>
              <span className="journal-counter-separator">/</span>
              <span>{twoDigits(count)}</span>
            </p>
            <div className="journal-progress">
              {slides.map((slide, index) => (
                <button
                  type="button"
                  key={slide.id}
                  className={["journal-progress-bar", index === active && "active", index === active && running && "running"].filter(Boolean).join(" ")}
                  aria-label={t.journalShowArticle(formatNumber(index + 1, language))}
                  aria-current={index === active}
                  onClick={() => setActive(index)}
                />
              ))}
            </div>
            <div className="journal-buttons">
              <button
                type="button"
                className="drag-arrow journal-playback"
                aria-label={paused ? t.journalPlay : t.journalPause}
                onClick={() => setPaused((current) => !current)}
              >
                <svg viewBox="0 0 12 12" aria-hidden="true">
                  {paused
                    ? <path d="M3.5 2v8l6-4z" fill="currentColor" />
                    : <path d="M4 2.5v7M8 2.5v7" fill="none" stroke="currentColor" strokeWidth="1.2" />}
                </svg>
              </button>
              <button type="button" className="drag-arrow drag-arrow-previous" aria-label={t.journalPrevious} onClick={() => go(-1)}>
                <ChevronIcon />
              </button>
              <button type="button" className="drag-arrow" aria-label={t.journalNext} onClick={() => go(1)}>
                <ChevronIcon />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
