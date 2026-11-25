"use client";

import Image from "next/image";
import { useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from "react";
import { transformation } from "@/data/company";
import { directionOf, formatNumber, resolveText } from "@/lib/i18n";
import { useLanguage } from "@/lib/usePreferences";
import { CompareIcon } from "../Icons";

/**
 * A draggable before/after comparison. The earlier image sits on the reading
 * direction's start side (left in English, right in Persian and Arabic). It
 * works with a mouse, touch (horizontal drags; vertical swipes still scroll the
 * page) and the keyboard through a focusable slider with arrow, Page and
 * Home/End keys.
 */
export function BeforeAfterComparison() {
  const { language, t } = useLanguage();
  const [value, setValue] = useState(50);
  const [dragging, setDragging] = useState(false);
  const stage = useRef<HTMLDivElement>(null);
  const rtl = directionOf(language) === "rtl";

  const clamp = (next: number) => Math.min(100, Math.max(0, next));

  function fromPointer(clientX: number) {
    const rect = stage.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return;
    const fromLeft = ((clientX - rect.left) / rect.width) * 100;
    setValue(clamp(rtl ? 100 - fromLeft : fromLeft));
  }

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragging(true);
    fromPointer(event.clientX);
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    // ArrowRight moves the handle right on screen in either direction.
    const towardEnd = rtl ? -1 : 1;
    const steps: Record<string, number> = {
      ArrowRight: 5 * towardEnd,
      ArrowLeft: -5 * towardEnd,
      ArrowUp: 5,
      ArrowDown: -5,
      PageUp: 20,
      PageDown: -20,
    };
    if (event.key === "Home") setValue(0);
    else if (event.key === "End") setValue(100);
    else if (event.key in steps) setValue((current) => clamp(current + steps[event.key]));
    else return;
    event.preventDefault();
  }

  const percent = formatNumber(Math.round(value), language);

  return (
    <figure className="comparison">
      <div
        ref={stage}
        className={dragging ? "comparison-stage dragging" : "comparison-stage"}
        style={{ "--split": `${value}%`, aspectRatio: `${transformation.after.width} / ${transformation.after.height}` } as CSSProperties}
        onPointerDown={onPointerDown}
        onPointerMove={(event) => dragging && fromPointer(event.clientX)}
        onPointerUp={() => setDragging(false)}
        onPointerCancel={() => setDragging(false)}
      >
        <Image
          src={transformation.after.src}
          alt={t.afterAlt}
          fill
          sizes="(max-width: 900px) 100vw, 56vw"
          className="comparison-image"
        />
        <div className="comparison-before">
          <Image
            src={transformation.before.src}
            alt={t.beforeAlt}
            fill
            sizes="(max-width: 900px) 100vw, 56vw"
            className="comparison-image"
          />
        </div>
        <span className="comparison-label comparison-label-before" aria-hidden="true">{t.beforeLabel}</span>
        <span className="comparison-label comparison-label-after" aria-hidden="true">{t.afterLabel}</span>
        <div
          className="comparison-handle"
          role="slider"
          tabIndex={0}
          aria-label={t.comparisonLabel}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(value)}
          aria-valuetext={t.comparisonValue(`${percent}${language === "en" ? "%" : "٪"}`)}
          aria-orientation="horizontal"
          onKeyDown={onKeyDown}
        >
          <span className="comparison-knob">
            <CompareIcon />
          </span>
        </div>
      </div>
      <figcaption className="comparison-caption">{t.comparisonHint}</figcaption>
    </figure>
  );
}

export function BeforeAfter() {
  const { language, t } = useLanguage();
  // The original heading and text are Persian only. Other languages use the
  // interface heading and leave the Persian description out.
  const title = resolveText(transformation.title, language);
  const intro = language === "fa" ? resolveText(transformation.paragraphs[0], language) : undefined;

  return (
    <section className="section home-transformation" aria-labelledby="transformation-title">
      <div className="container transformation-grid">
        <div className="transformation-copy">
          <h2 id="transformation-title" className="section-title section-title-small">
            {title && language === "fa" ? title.text : t.beforeAfterTitle}
          </h2>
          {intro && <p className="transformation-text">{intro.text}</p>}
        </div>
        <BeforeAfterComparison />
      </div>
    </section>
  );
}
