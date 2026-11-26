"use client";

import Link from "next/link";
import { projectTitleText, type Project } from "@/data/projects";
import { textOf } from "@/lib/i18n";
import { primaryMeasurement, projectKicker, statusLabel } from "@/lib/projectDisplay";
import { useLanguage } from "@/lib/usePreferences";
import { ArrowIcon } from "./ArrowIcon";

export function ProjectIndexList({ projects }: { projects: Project[] }) {
  const { language, t } = useLanguage();

  return (
    <ul className="project-index">
      {projects.map((project) => {
        const title = projectTitleText(project, language);
        const meta = [
          projectKicker(project, language)?.text,
          statusLabel(project, language),
          textOf(project.location?.city, language) ?? textOf(project.location?.province, language),
          project.status === "completed" ? textOf(project.facts.completionYear, language, "en") : primaryMeasurement(project, language, t),
        ].filter((item): item is string => Boolean(item));

        return (
          <li key={project.code}>
            <Link href={`/projects/${project.slug}`} className="project-index-link">
              <span className="project-index-title" lang={title.lang !== language ? title.lang : undefined}>{title.text}</span>
              <span className="project-index-meta">
                {meta.map((item) => <span key={item}>{item}</span>)}
              </span>
              <span className="project-index-arrow"><ArrowIcon /></span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
