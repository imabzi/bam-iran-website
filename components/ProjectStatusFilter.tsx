"use client";

import { useRef, type KeyboardEvent } from "react";
import { projectStatuses, projectStatusIds, type ProjectStatus } from "@/data/projects";
import { directionOf, textOf } from "@/lib/i18n";
import { useLanguage } from "@/lib/usePreferences";

export type StatusSelection = "all" | ProjectStatus;

function useStatusLabel() {
  const { language } = useLanguage();
  return (status: ProjectStatus) => textOf(projectStatuses[status], language) ?? projectStatuses[status].fa;
}

/**
 * The homepage status tabs: ongoing, under negotiation, completed, in that
 * order in every language. A WAI-ARIA tablist with roving focus, like the
 * event tabs: arrow keys move between tabs (mirrored in right-to-left
 * languages), Home and End jump to the ends.
 */
export function ProjectStatusTabs({ selected, onSelect, panelId }: { selected: ProjectStatus; onSelect: (status: ProjectStatus) => void; panelId: string }) {
  const { language, t } = useLanguage();
  const label = useStatusLabel();
  const refs = useRef<Array<HTMLButtonElement | null>>([]);

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const rtl = directionOf(language) === "rtl";
    const count = projectStatusIds.length;
    let next: number | null = null;
    if (event.key === (rtl ? "ArrowLeft" : "ArrowRight")) next = (index + 1) % count;
    else if (event.key === (rtl ? "ArrowRight" : "ArrowLeft")) next = (index - 1 + count) % count;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = count - 1;
    if (next === null) return;
    event.preventDefault();
    refs.current[next]?.focus();
    onSelect(projectStatusIds[next]);
  }

  return (
    <div className="category-filter status-tabs" role="tablist" aria-label={t.projectsStatusLabel}>
      {projectStatusIds.map((status, index) => {
        const active = status === selected;
        return (
          <button
            key={status}
            ref={(element) => { refs.current[index] = element; }}
            type="button"
            role="tab"
            id={`${panelId}-tab-${status}`}
            aria-selected={active}
            aria-controls={panelId}
            tabIndex={active ? 0 : -1}
            className={active ? "category active" : "category"}
            onClick={() => onSelect(status)}
            onKeyDown={(event) => onKeyDown(event, index)}
          >
            {label(status)}
          </button>
        );
      })}
    </div>
  );
}

/** The archive's status filter: all projects, then each status. Works with the category filter. */
export function ProjectStatusFilter({ selected, onSelect }: { selected: StatusSelection; onSelect: (selection: StatusSelection) => void }) {
  const { t } = useLanguage();
  const label = useStatusLabel();
  const options: Array<{ id: StatusSelection; label: string }> = [
    { id: "all", label: t.projectsStatusAll },
    ...projectStatusIds.map((id) => ({ id, label: label(id) })),
  ];

  return (
    <div className="category-filter status-filter" role="group" aria-label={t.projectsStatusLabel}>
      {options.map(({ id, label: text }) => (
        <button
          type="button"
          key={id}
          className={id === selected ? "category active" : "category"}
          aria-pressed={id === selected}
          onClick={(event) => {
            event.currentTarget.scrollIntoView({ inline: "nearest", block: "nearest" });
            onSelect(id);
          }}
        >
          {text}
        </button>
      ))}
    </div>
  );
}
