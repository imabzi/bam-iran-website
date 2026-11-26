"use client";

import type { Project } from "@/data/projects";
import { formatNumber, resolveText, type Dictionary, type Language } from "@/lib/i18n";
import { useLanguage } from "@/lib/usePreferences";

type Row = { label: string; text: string; lang?: Language };

function technicalRows(project: Project, language: Language, t: Dictionary): Row[] {
  const { facts } = project;
  const entries: Array<[string, typeof facts.siteConditions]> = [
    [t.factConstructionMethod, facts.constructionMethod],
    [t.factSiteConditions, facts.siteConditions],
    [t.factEngineeringChallenges, facts.engineeringChallenges],
    [t.factTechnicalSolutions, facts.technicalSolutions],
    [t.factQualityControl, facts.qualityControl],
    [t.factEngineeringAchievements, facts.engineeringAchievements],
  ];
  return entries.flatMap(([label, value]) => {
    const resolved = resolveText(value, language);
    return resolved ? [{ label, text: resolved.text, lang: resolved.lang !== language ? resolved.lang : undefined }] : [];
  });
}

/**
 * "Technical details and construction challenges". Shown only when the project
 * has at least one verified technical statement (construction
 * method, site conditions, challenges, solutions, quality control or
 * achievements). Structure, areas, floors, blocks and units stay in the facts list.
 */
export function ProjectTechnicalDetails({ project }: { project: Project }) {
  const { language, t } = useLanguage();
  const rows = technicalRows(project, language, t);
  if (rows.length === 0) return null;

  return (
    <section className="technical-section" aria-labelledby="technical-title">
      <h2 id="technical-title" className="section-kicker">{t.technicalDetails}</h2>
      <dl className="technical-list">
        {rows.map((row, index) => (
          <div key={row.label} className="technical-row">
            <dt>
              <span className="technical-index" aria-hidden="true">{formatNumber(index + 1, language, { minimumIntegerDigits: 2 })}</span>
              {row.label}
            </dt>
            <dd lang={row.lang}>{row.text}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

/** Approved project videos, when any are recorded. */
export function ProjectVideos({ videos, title }: { videos: string[] | undefined; title: string }) {
  const { t } = useLanguage();
  if (!videos || videos.length === 0) return null;
  return (
    <section className="gallery-section">
      <span className="section-kicker">{t.projectVideos}</span>
      <div className="project-videos">
        {videos.map((src) => (
          <video key={src} controls preload="metadata" playsInline aria-label={title}>
            <source src={src} type="video/mp4" />
          </video>
        ))}
      </div>
    </section>
  );
}

/** The brochure button. Rendered only when a brochure file is recorded. */
export function ProjectBrochureLink({ project }: { project: Project }) {
  const { language, t } = useLanguage();
  if (!project.brochure?.src) return null;
  const size = resolveText(project.brochure.sizeLabel, language);
  return (
    <a href={project.brochure.src} className="brochure-link" download>
      <svg viewBox="0 0 20 20" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.3">
        <path d="M10 3v10M6 9l4 4 4-4M4 16h12" />
      </svg>
      <span>{t.downloadBrochure}</span>
      {size && <span className="brochure-size">{size.text}</span>}
    </a>
  );
}
