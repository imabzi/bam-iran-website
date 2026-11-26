"use client";

import type { Project } from "@/data/projects";
import { ProjectCard } from "./ProjectCard";

export function ProjectVisualGrid({ projects }: { projects: Project[] }) {
  return (
    <div className="project-grid">
      {projects.map((project) => (
        <ProjectCard key={project.code} project={project} variant="archive" />
      ))}
    </div>
  );
}
