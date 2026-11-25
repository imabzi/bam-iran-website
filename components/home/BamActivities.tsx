"use client";

import Image from "next/image";
import { useId, useState } from "react";
import { activities, activitiesHeading, type Activity, type ActivityIllustration } from "@/data/activities";
import { getProjectByCode, projectCategories } from "@/data/projects";
import { formatNumber, resolveText, textOf, type Language } from "@/lib/i18n";
import { useLanguage } from "@/lib/usePreferences";
import { LocalizedText } from "../Text";
import { TextLink } from "../ui";

const range = (from: number, to: number, step: number) => {
  const values: number[] = [];
  for (let value = from; value <= to + 0.001; value += step) values.push(value);
  return values;
};

// Line drawings for the two activities with no verified archive photograph.
// Same drawing language as the architect artwork (components/ArchitectVectorArtwork.tsx).
function ActivityDrawing({ kind }: { kind: ActivityIllustration }) {
  return (
    <svg viewBox="0 0 400 500" className="vector-artwork activity-drawing" aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMid slice">
      <g className="va-grid">
        {range(25, 375, 25).map((x) => <line key={`x${x}`} x1={x} y1={0} x2={x} y2={500} />)}
        {range(25, 475, 25).map((y) => <line key={`y${y}`} x1={0} y1={y} x2={400} y2={y} />)}
      </g>
      {kind === "mass-housing" ? (
        // Repeated residential slabs: one design, built many times.
        <>
          {[0, 1, 2, 3].map((index) => {
            const x = 44 + index * 82;
            const top = 150 + (index % 2) * 34;
            return (
              <g key={index}>
                <rect className="va-strong" x={x} y={top} width={64} height={380 - top} />
                <g className="va-line">
                  {range(top + 18, 362, 18).map((y) => <line key={y} x1={x} y1={y} x2={x + 64} y2={y} />)}
                  <line x1={x + 32} y1={top} x2={x + 32} y2={380} />
                </g>
              </g>
            );
          })}
          <line className="va-accent" x1={126} y1={256} x2={190} y2={256} />
          <line className="va-strong" x1={24} y1={380} x2={376} y2={380} />
          <line className="va-faint va-dashed" x1={24} y1={410} x2={376} y2={410} />
        </>
      ) : (
        // The historic urban fabric: a courtyard house in plan, with its arches.
        <>
          <rect className="va-strong va-nofill" x={70} y={90} width={260} height={260} />
          <rect className="va-line va-nofill" x={130} y={150} width={140} height={140} />
          <g className="va-line">
            {range(140, 245, 26).map((x) => <path key={`t${x}`} d={`M${x} 150 V138 A13 13 0 0 1 ${x + 26} 138 V150`} />)}
            {range(140, 245, 26).map((x) => <path key={`b${x}`} d={`M${x} 290 V302 A13 13 0 0 0 ${x + 26} 302 V290`} />)}
            <line x1={70} y1={150} x2={130} y2={150} />
            <line x1={270} y1={150} x2={330} y2={150} />
            <line x1={70} y1={290} x2={130} y2={290} />
            <line x1={270} y1={290} x2={330} y2={290} />
          </g>
          <rect className="va-accent va-nofill" x={182} y={202} width={36} height={36} />
          <g className="va-faint">
            <line x1={200} y1={60} x2={200} y2={380} />
            <line x1={40} y1={220} x2={360} y2={220} />
          </g>
          <line className="va-strong" x1={24} y1={420} x2={376} y2={420} />
        </>
      )}
    </svg>
  );
}

function ActivityVisual({ activity, language, sizes }: { activity: Activity; language: Language; sizes: string }) {
  const project = activity.image ? getProjectByCode(activity.image.projectCode) : undefined;
  if (activity.image && project) {
    const title = textOf(project.title, language) ?? project.title.en;
    return (
      <figure className="activity-figure">
        <div className="activity-frame">
          <Image src={activity.image.src} alt={title} fill sizes={sizes} className="activity-image" style={{ objectPosition: activity.image.position }} />
        </div>
        <figcaption className="media-caption">{title}</figcaption>
      </figure>
    );
  }
  return (
    <figure className="activity-figure">
      <div className="activity-frame activity-frame-drawing">
        <ActivityDrawing kind={activity.illustration} />
      </div>
    </figure>
  );
}

function pad(value: number, language: Language) {
  return formatNumber(value, language).padStart(2, formatNumber(0, language));
}

export function BamActivities() {
  const { language, t } = useLanguage();
  const baseId = useId();
  const [open, setOpen] = useState<string | null>(activities[0]?.id ?? null);
  // The large visual keeps the last opened activity when all are closed.
  const [shown, setShown] = useState<string>(activities[0]?.id ?? "");
  const heading = resolveText(activitiesHeading, language);

  function toggle(id: string) {
    setOpen((current) => (current === id ? null : id));
    setShown(id);
  }

  return (
    <section className="section home-activities" aria-labelledby="activities-title">
      <div className="container">
        <div className="section-heading">
          <div className="section-heading-copy">
            {heading && (
              <h2 id="activities-title" className="section-title" lang={heading.lang !== language ? heading.lang : undefined}>
                {heading.text}
              </h2>
            )}
          </div>
        </div>

        <div className="activities-grid">
          <div className="activities-visual" aria-hidden="true">
            {activities.map((activity) => (
              <div key={activity.id} className={activity.id === shown ? "activities-visual-item active" : "activities-visual-item"}>
                <ActivityVisual activity={activity} language={language} sizes="(max-width: 900px) 1px, 40vw" />
              </div>
            ))}
          </div>

          <ol className="activities-list">
            {activities.map((activity, index) => {
              const expanded = open === activity.id;
              const buttonId = `${baseId}-button-${activity.id}`;
              const panelId = `${baseId}-panel-${activity.id}`;
              const title = resolveText(activity.title, language);
              const category = activity.link?.category;
              return (
                <li key={activity.id} className={expanded ? "activity is-open" : "activity"}>
                  <h3 className="activity-heading">
                    <button
                      type="button"
                      id={buttonId}
                      className="activity-trigger"
                      aria-expanded={expanded}
                      aria-controls={panelId}
                      onClick={() => toggle(activity.id)}
                    >
                      <span className="activity-index" aria-hidden="true">{pad(index + 1, language)}</span>
                      <span className="activity-title" lang={title && title.lang !== language ? title.lang : undefined}>
                        {title?.text}
                      </span>
                      <span className="activity-toggle" aria-hidden="true" />
                    </button>
                  </h3>
                  <div id={panelId} role="region" aria-labelledby={buttonId} className="activity-panel" inert={!expanded}>
                    <div className="activity-panel-inner">
                      <div className="activity-panel-body">
                        <LocalizedText as="p" className="activity-description" value={activity.description} language={language} />
                        {activity.link && (
                          <TextLink href={activity.link.href}>
                            {category
                              ? t.activityViewCategory(textOf(projectCategories[category], language) ?? projectCategories[category].en)
                              : t.activityRelatedArticle}
                          </TextLink>
                        )}
                        <div className="activity-inline-visual">
                          {expanded && <ActivityVisual activity={activity} language={language} sizes="(max-width: 900px) 100vw, 1px" />}
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
