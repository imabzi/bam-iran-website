"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { projectCategories, projects, type CategoryId } from "@/data/projects";
import { useDocumentTitle, useLanguage, useViewMode } from "@/lib/usePreferences";
import { CategoryFilter, type CategorySelection } from "./CategoryFilter";
import { ProjectIndexList } from "./ProjectIndexList";
import { ProjectVisualGrid } from "./ProjectVisualGrid";
import { ViewSwitcher } from "./ViewSwitcher";

export function ProjectArchive() {
  const { t } = useLanguage();
  const { view } = useViewMode();
  const [category, setCategory] = useState<CategorySelection>("all");
  const visible = useMemo(
    () => category === "all" ? projects : projects.filter((project) => project.category.id === category),
    [category]
  );
  useDocumentTitle(t.archiveTitle);

  // A link such as /projects?category=residential opens on that category (used
  // by the homepage Activities section). The choice is kept in the URL so a
  // filtered view can be shared. Read after hydration: the page is static.
  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get("category");
    if (requested && requested in projectCategories) setCategory(requested as CategoryId);
  }, []);
  const selectCategory = (next: CategorySelection) => {
    setCategory(next);
    const url = new URL(window.location.href);
    if (next === "all") url.searchParams.delete("category");
    else url.searchParams.set("category", next);
    window.history.replaceState(window.history.state, "", url);
  };

  // A shorter list can leave the reader scrolled past the end of the archive.
  const archiveRef = useRef<HTMLElement>(null);
  const selection = `${view}:${category}`;
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
      <div className="archive-controls">
        <CategoryFilter selected={category} onSelect={selectCategory} />
        <ViewSwitcher />
      </div>
      {view === "visual" ? <ProjectVisualGrid projects={visible} /> : <ProjectIndexList projects={visible} />}
    </section>
  );
}
