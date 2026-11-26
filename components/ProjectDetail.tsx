"use client";

import Link from "next/link";
import { projectTitleText, type Project, type ProjectDrawing } from "@/data/projects";
import { resolveText, type Language } from "@/lib/i18n";
import { projectKicker, shortPlace } from "@/lib/projectDisplay";
import { useDocumentTitle, useLanguage } from "@/lib/usePreferences";
import { ArrowIcon } from "./ArrowIcon";
import { Header } from "./Header";
import { LocationButton } from "./LocationButton";
import { ProjectStatusLabel } from "./ProjectCard";
import { ProjectGallery } from "./ProjectGallery";
import { ProjectHeroSlider } from "./ProjectHeroSlider";
import { ProjectInformation } from "./ProjectInformation";
import { ProjectBrochureLink, ProjectTechnicalDetails, ProjectVideos } from "./ProjectTechnicalDetails";
import { SiteFooter } from "./SiteFooter";

// Drawings grouped by building or block, in the order they first appear.
function drawingGroups(drawings: ProjectDrawing[] | undefined, language: Language) {
  const groups: Array<{ label?: string; images: string[] }> = [];
  for (const drawing of drawings ?? []) {
    const label = resolveText(drawing.block, language)?.text;
    const group = groups.find((item) => item.label === label) ?? groups[groups.push({ label, images: [] }) - 1];
    group.images.push(drawing.src);
  }
  return groups;
}

/**
 * One project page for every status. Always shows the name, status, the known
 * place and facts, and the hero (or its placeholder). Every other section is
 * shown only when it has content.
 */
export function ProjectDetail({ project }: { project: Project }) {
  const { language, t } = useLanguage();
  const titleText = projectTitleText(project, language);
  const title = titleText.text;
  const kicker = projectKicker(project, language);
  // The map button needs an approved link; otherwise the known place is text.
  const place = project.location?.googleMapsUrl ? undefined : shortPlace(project, language, t);
  const { images } = project;
  const hero = images.hero ? [images.hero, ...images.exterior.filter((src) => src !== images.hero)] : images.exterior;
  useDocumentTitle(`${title} — ${t.brand}`);

  return (
    <>
      <Header />
      <main id="main" className="detail-page">
        <section className="detail-intro">
          <Link href="/projects" className="back-link">
            <ArrowIcon />
            <span>{t.archiveTitle}</span>
          </Link>
          <div className="detail-title-row">
            <div className="detail-title-copy">
              {kicker && <span className="eyebrow" lang={kicker.lang !== language ? kicker.lang : undefined}>{kicker.text}</span>}
              <h1 className="detail-title" lang={titleText.lang !== language ? titleText.lang : undefined}>{title}</h1>
              <p className="detail-status">
                <ProjectStatusLabel project={project} />
                {place && (
                  <>
                    <span className="meta-dot" aria-hidden="true" />
                    <span lang={place.lang !== language ? place.lang : undefined}>{place.text}</span>
                  </>
                )}
              </p>
            </div>
            <div className="detail-actions">
              <ProjectBrochureLink project={project} />
              <LocationButton url={project.location?.googleMapsUrl} />
            </div>
          </div>
        </section>

        <ProjectHeroSlider images={hero} title={title} />
        <ProjectInformation project={project} />
        <ProjectTechnicalDetails project={project} />
        <ProjectGallery images={images.sitePlans ?? []} title={title} label={t.sitePlan} contain />
        <ProjectGallery images={[]} groups={drawingGroups(images.drawings, language)} title={title} label={t.architecturalDrawings} contain />
        <ProjectGallery images={images.floorPlans ?? []} title={title} label={t.floorPlans} contain />
        <ProjectGallery images={images.interior} title={title} />
        <ProjectGallery images={images.gallery ?? []} title={title} label={t.projectGallery} />
        <ProjectGallery images={images.progress ?? []} title={title} label={t.constructionProgress} />
        <ProjectVideos videos={images.videos} title={title} />

        <section className="project-end">
          <Link href="/projects">{t.browseAllProjects}</Link>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
