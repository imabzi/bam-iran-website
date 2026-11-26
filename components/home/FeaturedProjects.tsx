"use client";

import { useId, useState } from "react";
import { homepageProjects } from "@/data/home";
import type { ProjectStatus } from "@/data/projects";
import { useLanguage } from "@/lib/usePreferences";
import { DragCarousel } from "../DragCarousel";
import { ProjectCard } from "../ProjectCard";
import { ProjectStatusTabs } from "../ProjectStatusFilter";
import { SectionHeading, TextLink } from "../ui";

/**
 * The homepage Projects section: three status tabs over the two-row drag
 * carousel. Every tab uses the same card, and every project with the status is
 * shown, with or without photographs. "View all projects" opens the archive
 * filtered to the selected status.
 */
export function FeaturedProjects() {
  const { language, t } = useLanguage();
  const panelId = useId();
  const [status, setStatus] = useState<ProjectStatus>("ongoing");
  const list = homepageProjects(status, language);
  const archiveHref = `/projects?status=${status}`;

  return (
    <section className="section home-projects" aria-labelledby="selected-projects-title">
      <div className="container">
        <SectionHeading
          id="selected-projects-title"
          title={t.projectsSectionTitle}
          action={<TextLink href={archiveHref} className="hide-narrow">{t.viewAllProjects}</TextLink>}
        />
        <div className="home-filter">
          <ProjectStatusTabs selected={status} onSelect={setStatus} panelId={panelId} />
        </div>
        <div id={panelId} role="tabpanel" aria-labelledby={`${panelId}-tab-${status}`} className="project-panel">
          {list.length === 0 ? (
            <p className="empty-state">{t.projectsEmpty}</p>
          ) : (
            // Keyed by status, so a new tab starts again from the first column.
            <div className="carousel-fade" key={status}>
              <DragCarousel label={t.projectsSectionTitle}>
                {list.map((project) => (
                  <ProjectCard key={project.code} project={project} variant="home" />
                ))}
              </DragCarousel>
            </div>
          )}
        </div>
        <div className="section-end show-narrow">
          <TextLink href={archiveHref}>{t.viewAllProjects}</TextLink>
        </div>
      </div>
    </section>
  );
}
