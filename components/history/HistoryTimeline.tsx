"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { historyIntro, milestoneKindLabels, milestones, networkLabels, type Milestone } from "@/data/history";
import { formatNumber, resolveText, type Language, type ResolvedText } from "@/lib/i18n";
import { useLanguage } from "@/lib/usePreferences";
import { HistoryDrawing } from "./HistoryDrawings";

function yearsOf(milestone: Milestone, language: Language) {
  return milestone.years.map((year) => formatNumber(year, language, { useGrouping: false })).join("–");
}

function langAttr(text: ResolvedText | undefined, language: Language) {
  return text && text.lang !== language ? text.lang : undefined;
}

// The visual for a milestone: a verified photograph or rendering of a BAM
// project from that period, or abstract linework.
function MilestoneVisual({ milestone, language, sizes, labels }: { milestone: Milestone; language: Language; sizes: string; labels: Record<"iran" | "uae" | "armenia" | "tajikistan", string> }) {
  const { visual } = milestone;
  if (visual.type === "drawing") {
    return (
      <div className={`visual-drawing visual-${visual.drawing}`}>
        <HistoryDrawing id={visual.drawing} networkLabels={labels} />
      </div>
    );
  }
  const caption = resolveText(visual.caption, language);
  return (
    <figure className="visual-photo">
      <Image src={visual.src} alt={caption?.text ?? ""} fill sizes={sizes} className="visual-image" style={{ objectPosition: visual.position }} />
      {caption && (
        <figcaption className="visual-caption" lang={langAttr(caption, language)}>
          {caption.text}
        </figcaption>
      )}
    </figure>
  );
}

function KindBadge({ milestone, language }: { milestone: Milestone; language: Language }) {
  if (milestone.kind === "history") return null;
  const label = resolveText(milestoneKindLabels[milestone.kind], language);
  if (!label) return null;
  return <span className="step-kind" data-kind={milestone.kind}>{label.text}</span>;
}

function useLabels(language: Language) {
  return {
    iran: resolveText(networkLabels.iran, language)?.text ?? "",
    uae: resolveText(networkLabels.uae, language)?.text ?? "",
    armenia: resolveText(networkLabels.armenia, language)?.text ?? "",
    tajikistan: resolveText(networkLabels.tajikistan, language)?.text ?? "",
  };
}

/**
 * BAM's history, from data/history.ts.
 *
 * `home` — the signature scroll story. On wide screens the narrative scrolls
 * past a sticky drawing board whose image follows the milestone in view, with
 * a dimension-line scale that fills as the reader moves through the years. The
 * page scrolls normally throughout: nothing is pinned or hijacked. On narrow
 * screens it becomes a vertical timeline with each image inline.
 *
 * `full` — the About page: the same milestones as a long-form editorial list.
 *
 * Every milestone is in the HTML from the start, so the whole history reads
 * without script or animation. Plans and the vision are always labelled.
 */
export function HistoryTimeline({ variant = "home", headingLevel = 2 }: { variant?: "home" | "full"; headingLevel?: 2 | 3 }) {
  const { language, t } = useLanguage();
  const labels = useLabels(language);
  const [active, setActive] = useState(0);
  const stage = useRef<HTMLDivElement>(null);
  const steps = useRef<Array<HTMLLIElement | null>>([]);
  const items = milestones.filter((milestone) => resolveText(milestone.heading, language));

  // The milestone nearest the middle of the viewport is the active one.
  useEffect(() => {
    if (variant !== "home") return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const index = steps.current.indexOf(entry.target as HTMLLIElement);
          if (index >= 0) setActive(index);
        }
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    steps.current.forEach((step) => step && observer.observe(step));
    return () => observer.disconnect();
  }, [variant, items.length]);

  // The scale fills continuously with the reader's position in the story.
  useEffect(() => {
    if (variant !== "home") return;
    const element = stage.current;
    if (!element) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const box = element.getBoundingClientRect();
      const middle = window.innerHeight / 2;
      const progress = Math.min(1, Math.max(0, (middle - box.top) / Math.max(1, box.height - window.innerHeight / 2)));
      element.style.setProperty("--history-progress", progress.toFixed(4));
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
    // Re-run when the milestones first render (the language resolves after hydration).
  }, [variant, items.length]);

  const goTo = useCallback((index: number) => {
    const step = steps.current[index];
    if (!step) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    step.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
  }, []);

  const title = resolveText(historyIntro.title, language);
  if (items.length === 0 || !title) return null;
  const kicker = resolveText(historyIntro.kicker, language);
  const subtitle = resolveText(historyIntro.subtitle, language);
  const note = resolveText(historyIntro.yearsNote, language);
  const Heading = headingLevel === 2 ? "h2" : "h3";
  const StepHeading = headingLevel === 2 ? "h3" : "h4";
  const headingId = `history-title-${variant}`;

  const head = (
    <div className="history-head">
      {kicker && <span className="kicker">{kicker.text}</span>}
      <Heading id={headingId} className="history-title" lang={langAttr(title, language)}>{title.text}</Heading>
      {subtitle && <p className="history-subtitle" lang={langAttr(subtitle, language)}>{subtitle.text}</p>}
      {note && <p className="history-note">{note.text}</p>}
    </div>
  );

  const stepContent = (milestone: Milestone, index: number) => {
    const label = resolveText(milestone.label, language);
    const heading = resolveText(milestone.heading, language);
    const text = resolveText(milestone.text, language);
    return (
      <>
        <p className="step-year">
          <span className="step-index" aria-hidden="true">{formatNumber(index + 1, language, { minimumIntegerDigits: 2 })}</span>
          <time>{yearsOf(milestone, language)}</time>
        </p>
        <div className="step-copy">
          <div className="step-meta">
            {label && <span className="step-label" lang={langAttr(label, language)}>{label.text}</span>}
            <KindBadge milestone={milestone} language={language} />
          </div>
          {heading && <StepHeading className="step-heading" lang={langAttr(heading, language)}>{heading.text}</StepHeading>}
          {text && <p className="step-text" lang={langAttr(text, language)}>{text.text}</p>}
        </div>
        <div className="step-visual" data-kind={milestone.kind}>
          <MilestoneVisual milestone={milestone} language={language} sizes="(max-width: 1023px) 100vw, 50vw" labels={labels} />
        </div>
      </>
    );
  };

  if (variant === "full") {
    return (
      <section className="history history-full" aria-labelledby={headingId}>
        <div className="container">
          {head}
          <ol className="history-list">
            {items.map((milestone, index) => (
              <li key={milestone.id} className="history-entry" data-kind={milestone.kind}>
                {stepContent(milestone, index)}
              </li>
            ))}
          </ol>
        </div>
      </section>
    );
  }

  return (
    <section className="history history-home" aria-labelledby={headingId}>
      <div className="container">
        {head}
        <div className="history-stage" ref={stage} style={{ "--history-count": items.length } as CSSProperties}>
          <ol className="history-steps">
            {items.map((milestone, index) => (
              <li
                key={milestone.id}
                ref={(element) => { steps.current[index] = element; }}
                className="history-step"
                data-kind={milestone.kind}
                data-state={index === active ? "active" : index < active ? "past" : "future"}
              >
                {stepContent(milestone, index)}
              </li>
            ))}
          </ol>

          <div className="history-board">
            <div className="board-frame" aria-hidden="true">
              <span className="board-mark board-mark-1" />
              <span className="board-mark board-mark-2" />
              <span className="board-mark board-mark-3" />
              <span className="board-mark board-mark-4" />
              {items.map((milestone, index) => (
                <div key={milestone.id} className={index === active ? "board-layer active" : "board-layer"} data-kind={milestone.kind}>
                  <MilestoneVisual milestone={milestone} language={language} sizes="(max-width: 1023px) 1px, 55vw" labels={labels} />
                </div>
              ))}
              <p className="board-counter">
                <span>{formatNumber(active + 1, language, { minimumIntegerDigits: 2 })}</span>
                <span className="board-counter-line" />
                <span>{formatNumber(items.length, language, { minimumIntegerDigits: 2 })}</span>
              </p>
            </div>
            <nav className="history-scale" aria-label={t.timelineLabel}>
              <span className="scale-track" aria-hidden="true">
                <span className="scale-fill" />
              </span>
              <ol>
                {items.map((milestone, index) => (
                  <li key={milestone.id} data-kind={milestone.kind} data-state={index === active ? "active" : index < active ? "past" : "future"}>
                    <button
                      type="button"
                      onClick={() => goTo(index)}
                      aria-current={index === active ? "step" : undefined}
                      aria-label={`${t.timelineJump} ${yearsOf(milestone, language)}`}
                    >
                      <span className="scale-tick" aria-hidden="true" />
                      <span className="scale-year" aria-hidden="true">{yearsOf(milestone, language)}</span>
                    </button>
                  </li>
                ))}
              </ol>
            </nav>
          </div>
        </div>
      </div>
    </section>
  );
}
