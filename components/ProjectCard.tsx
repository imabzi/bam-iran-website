"use client";

import Link from "next/link";
import { getCoverImage, projectTitleText, type Project } from "@/data/projects";
import type { Language, ResolvedText } from "@/lib/i18n";
import { primaryMeasurement, projectKicker, shortPlace, statusLabel } from "@/lib/projectDisplay";
import { useLanguage } from "@/lib/usePreferences";
import { ArrowIcon } from "./ArrowIcon";
import { ProjectImage } from "./ProjectMedia";

function langOf(text: ResolvedText | undefined, language: Language) {
  return text && text.lang !== language ? text.lang : undefined;
}

export function ProjectStatusLabel({ project }: { project: Project }) {
  const { language } = useLanguage();
  return (
    <span className="status-label" data-status={project.status}>
      <span className="status-dot" aria-hidden="true" />
      {statusLabel(project, language)}
    </span>
  );
}

/**
 * The one project card, for every status, with or without photographs.
 *
 * Content, in order: image (or the placeholder, in the same frame), category or
 * development classification, status, name, place, and one measurement. The
 * name and status always render; a missing place or measurement leaves an
 * empty line of the same height, so cards in a row stay equal.
 *
 * `home` is the homepage carousel card (next/image, 16:9 frame); `archive` is
 * the archive's Visual View card (4:3 frame).
 */
export function ProjectCard({ project, variant, priority = false }: { project: Project; variant: "home" | "archive"; priority?: boolean }) {
  const { language, t } = useLanguage();
  const title = projectTitleText(project, language);
  const kicker = projectKicker(project, language);
  const place = shortPlace(project, language, t);
  const measurement = primaryMeasurement(project, language, t);
  const cover = getCoverImage(project);
  const home = variant === "home";

  const kickerLine = (
    <p className="project-card-kicker">
      {kicker && (
        <>
          <span lang={langOf(kicker, language)}>{kicker.text}</span>
          <span className="meta-dot" aria-hidden="true" />
        </>
      )}
      <ProjectStatusLabel project={project} />
    </p>
  );
  const TitleTag = home ? "h3" : "h2";
  const titleLine = (
    <TitleTag className={home ? "home-card-title" : "project-card-title"} lang={langOf(title, language)}>
      {title.text}
    </TitleTag>
  );
  const factsLine = (
    <p className="project-card-facts">
      {place && <span lang={langOf(place, language)}>{place.text}</span>}
      {place && measurement && <span className="meta-dot" aria-hidden="true" />}
      {measurement && <span>{measurement}</span>}
    </p>
  );

  if (home) {
    return (
      <Link href={`/projects/${project.slug}`} className="home-card project-card-unified" draggable={false}>
        <div className="home-card-media">
          <ProjectImage
            src={cover}
            alt={title.text}
            sizes="(max-width: 767px) 86vw, (max-width: 1760px) 48vw, 820px"
            priority={priority}
            className="home-card-image"
          />
        </div>
        <div className="home-card-meta">
          {kickerLine}
          {titleLine}
          {factsLine}
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/projects/${project.slug}`} className="project-card project-card-unified">
      <div className="project-image-wrap">
        <ProjectImage src={cover} alt="" native className="project-image" />
      </div>
      <div className="project-card-meta">
        <div className="project-card-text">
          {kickerLine}
          {titleLine}
          {factsLine}
        </div>
        <span className="card-arrow"><ArrowIcon /></span>
      </div>
    </Link>
  );
}
