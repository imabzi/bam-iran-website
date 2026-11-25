"use client";

import Link from "next/link";
import type { Project } from "@/data/projects";
import { textOf } from "@/lib/i18n";
import { useDocumentTitle, useLanguage } from "@/lib/usePreferences";
import { ArrowIcon } from "./ArrowIcon";
import { Header } from "./Header";
import { LocationButton } from "./LocationButton";
import { ProjectGallery } from "./ProjectGallery";
import { ProjectHeroSlider } from "./ProjectHeroSlider";
import { ProjectInformation } from "./ProjectInformation";
import { SiteFooter } from "./SiteFooter";
import { LocalizedText } from "./Text";

export function ProjectDetail({ project }: { project: Project }) {
  const { language, t } = useLanguage();
  const title = textOf(project.title, language) ?? project.title.en;
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
              <LocalizedText as="span" className="eyebrow" value={project.category} language={language} />
              <LocalizedText as="h1" className="detail-title" value={project.title} language={language} />
            </div>
            <LocationButton url={project.location?.googleMapsUrl} />
          </div>
        </section>

        <ProjectHeroSlider images={project.images.exterior} title={title} />
        <ProjectInformation project={project} />
        <ProjectGallery images={project.images.interior} title={title} />

        <section className="project-end">
          <Link href="/projects">{t.browseAllProjects}</Link>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
