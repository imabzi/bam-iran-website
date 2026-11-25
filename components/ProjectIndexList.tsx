"use client";

import Link from "next/link";
import type { Project } from "@/data/projects";
import { textOf } from "@/lib/i18n";
import { useLanguage } from "@/lib/usePreferences";
import { ArrowIcon } from "./ArrowIcon";
import { LocalizedText } from "./Text";

export function ProjectIndexList({ projects }: { projects: Project[] }) {
  const { language } = useLanguage();

  return (
    <ul className="project-index">
      {projects.map((project) => {
        const meta = [
          textOf(project.category, language),
          textOf(project.location?.city, language),
          textOf(project.facts.completionYear, language, "en"),
        ].filter(Boolean);

        return (
          <li key={project.code}>
            <Link href={`/projects/${project.slug}`} className="project-index-link">
              <LocalizedText className="project-index-title" value={project.title} language={language} />
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
