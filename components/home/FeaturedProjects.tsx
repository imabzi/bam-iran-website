"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { creditsForProject } from "@/data/architects";
import { selectedProjects } from "@/data/home";
import type { Project } from "@/data/projects";
import { resolveText, textOf, type Language } from "@/lib/i18n";
import { useLanguage } from "@/lib/usePreferences";
import { CategoryFilter, type CategorySelection } from "../CategoryFilter";
import { DragCarousel } from "../DragCarousel";
import { LocalizedText } from "../Text";
import { SectionHeading, TextLink } from "../ui";

function architectLine(project: Project, language: Language, separator: string) {
  const names = creditsForProject(project.code)
    .filter((credit) => credit.role === "lead-architect")
    .map((credit) => resolveText(credit.architect.name, language))
    .filter((name) => name !== undefined);
  if (names.length === 0) return undefined;
  return { text: names.map((name) => name.text).join(separator), lang: names[0].lang };
}

export function HomeProjectCard({ project, priority = false }: { project: Project; priority?: boolean }) {
  const { language, t } = useLanguage();
  const cover = project.images.cover ?? project.images.exterior[0];
  const architect = architectLine(project, language, t.listSeparator);

  return (
    <Link href={`/projects/${project.slug}`} className="home-card" draggable={false}>
      <div className="home-card-media">
        {cover && (
          <Image
            src={cover}
            alt={textOf(project.title, language) ?? project.title.en}
            fill
            sizes="(max-width: 767px) 86vw, (max-width: 1760px) 48vw, 820px"
            draggable={false}
            priority={priority}
            className="home-card-image"
          />
        )}
      </div>
      <div className="home-card-meta">
        <LocalizedText as="h3" className="home-card-title" value={project.title} language={language} />
        <p className="home-card-details">
          <LocalizedText value={project.category} language={language} />
          {architect && (
            <>
              <span className="meta-dot" aria-hidden="true" />
              <span lang={architect.lang !== language ? architect.lang : undefined}>{architect.text}</span>
            </>
          )}
        </p>
      </div>
    </Link>
  );
}

export function FeaturedProjects() {
  const { t } = useLanguage();
  const [category, setCategory] = useState<CategorySelection>("all");
  // Every photographed project in the category, curated ones first.
  const list = useMemo(() => selectedProjects(category, Infinity), [category]);

  return (
    <section className="section home-projects" aria-labelledby="selected-projects-title">
      <div className="container">
        <SectionHeading
          id="selected-projects-title"
          title={t.selectedProjects}
          action={<TextLink href="/projects" className="hide-narrow">{t.exploreArchive}</TextLink>}
        />
        <div className="home-filter">
          <CategoryFilter selected={category} onSelect={setCategory} />
        </div>
        {/* Keyed by category, so a new filter starts again from the first column. */}
        <div className="carousel-fade" key={category}>
          <DragCarousel label={t.selectedProjects}>
            {list.map((project) => (
              <HomeProjectCard key={project.code} project={project} />
            ))}
          </DragCarousel>
        </div>
        <div className="section-end show-narrow">
          <TextLink href="/projects">{t.exploreArchive}</TextLink>
        </div>
      </div>
    </section>
  );
}
