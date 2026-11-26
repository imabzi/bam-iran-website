"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { isListedIn, isProjectStatus, projectCategories, projects, type CategoryId } from "@/data/projects";
import { useDocumentTitle, useLanguage, useViewMode } from "@/lib/usePreferences";
import { CategoryFilter, type CategorySelection } from "./CategoryFilter";
import dynamic from "next/dynamic";
import { ProjectIndexList } from "./ProjectIndexList";
import { ProjectStatusFilter, type StatusSelection } from "./ProjectStatusFilter";
import { ProjectVisualGrid } from "./ProjectVisualGrid";
import { ViewSwitcher } from "./ViewSwitcher";

// Leaflet touches the window, so the map view loads in the browser only, and
// only when it is chosen.
const ProjectMapView = dynamic(() => import("./ProjectMapView").then((module) => module.ProjectMapView), { ssr: false });

export function ProjectArchive() {
  const { language, t } = useLanguage();
  const { view } = useViewMode();
  const [status, setStatus] = useState<StatusSelection>("all");
  const [category, setCategory] = useState<CategorySelection>("all");
  // Both filters apply together. "All" in either one never hides a project, so
  // a project without a category still lists under its status and "All".
  const visible = useMemo(
    () => projects.filter((project) =>
      isListedIn(project, language) &&
      (status === "all" || project.status === status) &&
      (category === "all" || project.category?.id === category)
    ),
    [status, category, language]
  );
  useDocumentTitle(t.archiveTitle);

  // A link such as /projects?status=ongoing&category=residential opens with
  // those filters (used by the homepage Projects and Activities sections). The
  // choice is kept in the URL so a filtered view can be shared. Read after
  // hydration: the page is static.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requestedStatus = params.get("status");
    const requestedCategory = params.get("category");
    if (isProjectStatus(requestedStatus)) setStatus(requestedStatus);
    if (requestedCategory && requestedCategory in projectCategories) setCategory(requestedCategory as CategoryId);
  }, []);
  const updateUrl = (key: "status" | "category", value: string) => {
    const url = new URL(window.location.href);
    if (value === "all") url.searchParams.delete(key);
    else url.searchParams.set(key, value);
    window.history.replaceState(window.history.state, "", url);
  };
  const selectStatus = (next: StatusSelection) => {
    setStatus(next);
    updateUrl("status", next);
  };
  const selectCategory = (next: CategorySelection) => {
    setCategory(next);
    updateUrl("category", next);
  };

  // A shorter list can leave the reader scrolled past the end of the archive.
  const archiveRef = useRef<HTMLElement>(null);
  const selection = `${view}:${status}:${category}`;
  const previousSelection = useRef(selection);
  useEffect(() => {
    if (previousSelection.current === selection) return;
    previousSelection.current = selection;
    const archive = archiveRef.current;
    if (archive && archive.getBoundingClientRect().top < 0) archive.scrollIntoView({ behavior: "instant" });
  }, [selection]);

  return (
    <section className="archive" id="projects" ref={archiveRef}>
      <h1 className="archive-title">{t.archiveTitle}</h1>
      <div className="archive-controls archive-controls-stacked">
        <div className="archive-filter-row archive-status-row">
          <ProjectStatusFilter selected={status} onSelect={selectStatus} />
        </div>
        <div className="archive-filter-row">
          <CategoryFilter selected={category} onSelect={selectCategory} />
          <ViewSwitcher />
        </div>
      </div>
      {visible.length === 0 ? (
        <p className="empty-state archive-empty">{t.projectsEmpty}</p>
      ) : view === "map" ? (
        <ProjectMapView projects={visible} />
      ) : view === "index" ? (
        <ProjectIndexList projects={visible} />
      ) : (
        <ProjectVisualGrid projects={visible} />
      )}
    </section>
  );
}
