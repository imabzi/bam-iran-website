"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type CSSProperties, type TouchEvent } from "react";
import { heroSlides } from "@/data/home";
import { getProjectByCode } from "@/data/projects";
import { directionOf, formatNumber, textOf } from "@/lib/i18n";
import { useLanguage, usePrefersReducedMotion } from "@/lib/usePreferences";
import { ArrowIcon } from "../ArrowIcon";
import { ChevronIcon } from "../Icons";
import { LocalizedText } from "../Text";

const SLIDE_DURATION = 7000;
const SWIPE_DISTANCE = 40;

const slides = heroSlides.flatMap((slide) => {
  const project = getProjectByCode(slide.projectCode);
  return project ? [{ ...slide, project }] : [];
});

export function HomeHero() {
  const { language, t } = useLanguage();
  const reducedMotion = usePrefersReducedMotion();
  const [active, setActive] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [focused, setFocused] = useState(false);
  const [touching, setTouching] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const count = slides.length;
  const autoplay = count > 1 && !reducedMotion && mounted;
  const holding = hovering || focused || touching;

  // Later slides load only after the first image has had the network to itself.
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!autoplay || holding) return;
    const timer = setTimeout(() => setActive((current) => (current + 1) % count), SLIDE_DURATION);
    return () => clearTimeout(timer);
  }, [active, autoplay, holding, count]);

  const go = useCallback((step: number) => setActive((current) => (current + step + count) % count), [count]);

  if (count === 0) return null;
  const slide = slides[active];
  const pad = (value: number) => formatNumber(value, language).padStart(2, formatNumber(0, language));

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
    const forward = directionOf(language) === "rtl" ? distance > 0 : distance < 0;
    go(forward ? 1 : -1);
  }

  return (
    <section
      className="home-hero"
      aria-roledescription="carousel"
      aria-label={t.heroLabel}
      onPointerEnter={(event) => { if (event.pointerType === "mouse") setHovering(true); }}
      onPointerLeave={() => setHovering(false)}
      onFocus={(event) => { if (event.target.matches(":focus-visible")) setFocused(true); }}
      onBlur={() => setFocused(false)}
      onTouchStart={count > 1 ? onTouchStart : undefined}
      onTouchEnd={count > 1 ? onTouchEnd : undefined}
      onTouchCancel={() => setTouching(false)}
    >
      <div className="hero-media">
        {slides.map((item, index) => (
          <div
            key={item.projectCode}
            className={index === active ? "hero-frame active" : "hero-frame"}
            style={{ "--pos": item.position, "--pos-mobile": item.mobilePosition } as CSSProperties}
            aria-hidden={index !== active}
          >
            {(index === 0 || mounted) && (
              <Image
                src={item.src}
                alt={textOf(item.project.title, language) ?? item.project.title.en}
                fill
                sizes="100vw"
                priority={index === 0}
                quality={80}
                className="hero-image"
              />
            )}
          </div>
        ))}
        <div className="hero-shade" aria-hidden="true" />
      </div>

      <div className="hero-content">
        <div className="hero-caption" key={slide.projectCode} aria-live={autoplay && !holding ? "off" : "polite"}>
          <LocalizedText as="p" className="hero-category" value={slide.project.category} language={language} />
          <LocalizedText as="h2" className="hero-title" value={slide.project.title} language={language} />
          <Link href={`/projects/${slide.project.slug}`} className="hero-link">
            <span>{t.heroViewProject}</span>
            <ArrowIcon />
          </Link>
        </div>

        {count > 1 && (
          <div className="hero-controls">
            <p className="hero-counter" aria-label={t.heroPosition(formatNumber(active + 1, language), formatNumber(count, language))}>
              <span>{pad(active + 1)}</span>
              <span className="hero-counter-line" aria-hidden="true" />
              <span>{pad(count)}</span>
            </p>
            <div className="hero-progress" aria-hidden="true">
              {slides.map((item, index) => (
                <span
                  key={item.projectCode}
                  className={[
                    "hero-progress-bar",
                    index === active ? "active" : "",
                    index < active ? "done" : "",
                    autoplay && !holding ? "running" : "",
                  ].join(" ")}
                  style={{ "--slide-duration": `${SLIDE_DURATION}ms` } as CSSProperties}
                />
              ))}
            </div>
            <div className="hero-arrows">
              <button type="button" className="hero-arrow hero-arrow-previous" aria-label={t.heroPrevious} onClick={() => go(-1)}>
                <ChevronIcon />
              </button>
              <button type="button" className="hero-arrow" aria-label={t.heroNext} onClick={() => go(1)}>
                <ChevronIcon />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
