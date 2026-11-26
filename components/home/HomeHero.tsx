"use client";

import { useEffect, useRef, useState } from "react";
import { heroVideo } from "@/data/home";
import { resolveText } from "@/lib/i18n";
import { useLanguage, usePrefersReducedMotion } from "@/lib/usePreferences";
import { BrandMark } from "../BrandMark";

/**
 * The homepage hero: BAM's own construction film, full screen, with the
 * official logo and a short statement.
 *
 * - The video is always muted, loops and plays inline. Playback starts from
 *   script, so a visitor who prefers reduced motion sees only the poster (a
 *   frame of the same film) and nothing moves until they press play.
 * - The poster shows while the video loads, so the hero is never black.
 * - A discreet button pauses and resumes it; the film also pauses while the
 *   hero is scrolled out of view.
 */
// Read at the moment of playback: the preference hook is false until hydration.
function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function HomeHero() {
  const { language, t } = useLanguage();
  const reducedMotion = usePrefersReducedMotion();
  const video = useRef<HTMLVideoElement>(null);
  const section = useRef<HTMLElement>(null);
  const [playing, setPlaying] = useState(false);
  // The visitor's own choice, once made, wins over the automatic behaviour.
  const userChoice = useRef<"play" | "pause" | null>(null);
  const visible = useRef(true);

  const statement = resolveText(heroVideo.statement, language);
  const support = resolveText(heroVideo.support, language);

  useEffect(() => {
    const element = video.current;
    if (!element) return;
    element.muted = true;
    element.defaultMuted = true;
    const wantsPlay = userChoice.current ? userChoice.current === "play" : !prefersReducedMotion();
    if (wantsPlay && visible.current) element.play().catch(() => setPlaying(false));
    else element.pause();
  }, [reducedMotion]);

  useEffect(() => {
    const element = section.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      visible.current = entry.isIntersecting;
      const media = video.current;
      if (!media) return;
      const wantsPlay = userChoice.current ? userChoice.current === "play" : !prefersReducedMotion();
      if (entry.isIntersecting && wantsPlay) media.play().catch(() => setPlaying(false));
      else if (!entry.isIntersecting) media.pause();
    }, { threshold: 0.05 });
    observer.observe(element);
    return () => observer.disconnect();
  }, [reducedMotion]);

  function toggle() {
    const element = video.current;
    if (!element) return;
    if (element.paused) {
      userChoice.current = "play";
      element.muted = true;
      element.play().catch(() => setPlaying(false));
    } else {
      userChoice.current = "pause";
      element.pause();
    }
  }

  return (
    <section ref={section} className="home-hero hero-cinema" aria-label={t.heroLabel}>
      <div className="hero-media">
        <video
          ref={video}
          className="hero-video"
          poster={heroVideo.poster}
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          tabIndex={-1}
          disablePictureInPicture
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        >
          <source src={heroVideo.src} type="video/mp4" />
        </video>
      </div>
      <div className="hero-shade" aria-hidden="true" />

      <div className="hero-center">
        <div className="hero-plaque">
          <BrandMark className="hero-logo" alt={t.companyName} priority sizes="(max-width: 767px) 34vw, (max-width: 1920px) 220px, 300px" />
        </div>
        {statement && (
          <p className="hero-statement" lang={statement.lang !== language ? statement.lang : undefined}>
            {statement.text}
          </p>
        )}
        {support && (
          <p className="hero-support" lang={support.lang !== language ? support.lang : undefined}>
            {support.text}
          </p>
        )}
      </div>

      <div className="hero-foot">
        <a href="#bam-in-numbers" className="hero-scroll">
          <span className="hero-scroll-line" aria-hidden="true" />
          <span>{t.heroScroll}</span>
        </a>
        <button
          type="button"
          className="hero-playback-toggle"
          aria-label={playing ? t.heroPauseVideo : t.heroPlayVideo}
          aria-pressed={!playing}
          onClick={toggle}
        >
          <svg viewBox="0 0 12 12" aria-hidden="true">
            {playing
              ? <path d="M4 2.5v7M8 2.5v7" fill="none" stroke="currentColor" strokeWidth="1.2" />
              : <path d="M3.5 2v8l6-4z" fill="currentColor" />}
          </svg>
        </button>
      </div>
    </section>
  );
}
