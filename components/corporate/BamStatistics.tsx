"use client";

import { useEffect, useRef, useState } from "react";
import { publishedMetrics, statisticsIntro, type Metric, type MetricIcon } from "@/data/statistics";
import { formatNumber, resolveText, type Language } from "@/lib/i18n";
import { useLanguage } from "@/lib/usePreferences";

// Fine line icons drawn on a 40-unit grid, in the manner of drawing symbols.
function MetricGlyph({ icon }: { icon: MetricIcon }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.1, strokeLinecap: "square" as const };
  return (
    <svg viewBox="0 0 40 40" className="metric-icon" aria-hidden="true" {...common}>
      {icon === "area" && (
        <>
          <path d="M8 12h24v20H8z" />
          <path d="M8 6v3M32 6v3M8 7.5h24" />
          <path d="M35 12h3M35 32h3M36.5 12v20" />
          <path d="M14 18h12v8H14z" opacity=".55" />
        </>
      )}
      {icon === "years" && (
        <>
          <path d="M6 34h28" />
          <path d="M10 34V20l10-8 10 8v14" />
          <path d="M16 34v-8h8v8" />
          <path d="M20 4v4M20 4l4 2-4 2" />
        </>
      )}
      {icon === "projects" && (
        <>
          <path d="M6 34h28M10 34V14h9v20M21 34V8h9v26" />
          <path d="M13 19h3M13 24h3M13 29h3M24 13h3M24 18h3M24 23h3M24 28h3" />
        </>
      )}
      {icon === "units" && (
        <>
          <path d="M8 34V10h24v24M4 34h32" />
          <path d="M8 18h24M8 26h24M16 10v24M24 10v24" opacity=".6" />
        </>
      )}
      {icon === "awards" && (
        <>
          <path d="M20 26a9 9 0 1 0 0-18 9 9 0 0 0 0 18z" />
          <path d="M15 24.5 13 34l7-3 7 3-2-9.5" />
          <path d="m20 12 1.6 3.3 3.6.5-2.6 2.5.6 3.6-3.2-1.7-3.2 1.7.6-3.6-2.6-2.5 3.6-.5z" />
        </>
      )}
    </svg>
  );
}

const DURATION = 1400;

function useCountUp(target: number, run: boolean) {
  // Starts at the final value, so the number is right without script and for
  // reduced motion. Counts once, from zero, when the section first appears.
  const [value, setValue] = useState(target);
  useEffect(() => {
    if (!run) return;
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / DURATION);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    setValue(0);
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [run, target]);
  return value;
}

function MetricItem({ metric, language, run }: { metric: Metric; language: Language; run: boolean }) {
  const value = useCountUp(metric.value ?? 0, run);
  const prefix = resolveText(metric.prefix, language);
  const unit = resolveText(metric.unit, language);
  const label = resolveText(metric.label, language);
  const note = resolveText(metric.note, language);
  const final = formatNumber(metric.value ?? 0, language);
  return (
    <li className="metric">
      <MetricGlyph icon={metric.icon} />
      <p className="metric-figure">
        {/* The final value for assistive technology; the counting digits are decorative. */}
        <span className="visually-hidden">{[prefix?.text, final, unit?.text, label?.text].filter(Boolean).join(" ")}</span>
        <span aria-hidden="true">
          {prefix && <span className="metric-prefix">{prefix.text}</span>}
          <span className="metric-value">{formatNumber(value, language)}</span>
          {unit && <span className="metric-unit">{unit.text}</span>}
        </span>
      </p>
      {label && <p className="metric-label" aria-hidden="true">{label.text}</p>}
      {note && <p className="metric-note">{note.text}</p>}
    </li>
  );
}

/** BAM in Numbers: the approved metrics only (data/statistics.ts). */
export function BamStatistics() {
  const { language } = useLanguage();
  const list = useRef<HTMLUListElement>(null);
  const [run, setRun] = useState(false);
  const metrics = publishedMetrics.filter((metric) => resolveText(metric.label, language));
  const title = resolveText(statisticsIntro.title, language);
  const kicker = resolveText(statisticsIntro.kicker, language);

  useEffect(() => {
    const element = list.current;
    if (!element || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Below the fold at load: count when it comes into view. Already visible: leave it.
    if (element.getBoundingClientRect().top < window.innerHeight) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setRun(true);
        observer.disconnect();
      }
    }, { threshold: 0.35 });
    observer.observe(element);
    return () => observer.disconnect();
    // The list renders once the language resolves after hydration.
  }, [metrics.length]);

  if (metrics.length === 0 || !title) return null;

  return (
    <section className="bam-numbers" id="bam-in-numbers" aria-labelledby="bam-numbers-title">
      <div className="container">
        <div className="bam-numbers-head">
          {kicker && <span className="kicker">{kicker.text}</span>}
          <h2 id="bam-numbers-title" className="section-title">{title.text}</h2>
        </div>
        <ul ref={list} className="metric-grid" data-count={metrics.length}>
          {metrics.map((metric) => (
            <MetricItem key={metric.id} metric={metric} language={language} run={run} />
          ))}
        </ul>
      </div>
    </section>
  );
}
