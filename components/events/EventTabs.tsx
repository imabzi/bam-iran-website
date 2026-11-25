"use client";

import { useRef, type KeyboardEvent } from "react";
import { directionOf } from "@/lib/i18n";
import { useLanguage } from "@/lib/usePreferences";

export type EventTab = "all" | "past" | "upcoming";

/**
 * Event filter tabs, styled like the project category filter. A WAI-ARIA
 * tablist with roving focus: arrow keys move between tabs (mirrored in
 * right-to-left languages), Home and End jump to the ends, and a tab is
 * selected as it receives focus.
 */
export function EventCategoryTabs({ selected, onSelect, panelId }: { selected: EventTab; onSelect: (tab: EventTab) => void; panelId: string }) {
  const { language, t } = useLanguage();
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  // The order is fixed in every language: all, past, upcoming.
  const tabs: Array<{ id: EventTab; label: string }> = [
    { id: "all", label: t.eventsTabAll },
    { id: "past", label: t.eventsTabPast },
    { id: "upcoming", label: t.eventsTabUpcoming },
  ];

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const forward = directionOf(language) === "rtl" ? "ArrowLeft" : "ArrowRight";
    const backward = directionOf(language) === "rtl" ? "ArrowRight" : "ArrowLeft";
    let next: number | null = null;
    if (event.key === forward) next = (index + 1) % tabs.length;
    else if (event.key === backward) next = (index - 1 + tabs.length) % tabs.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = tabs.length - 1;
    if (next === null) return;
    event.preventDefault();
    refs.current[next]?.focus();
    onSelect(tabs[next].id);
  }

  return (
    <div className="category-filter event-tabs" role="tablist" aria-label={t.eventsTabsLabel}>
      {tabs.map((tab, index) => {
        const active = tab.id === selected;
        return (
          <button
            key={tab.id}
            ref={(element) => { refs.current[index] = element; }}
            type="button"
            role="tab"
            id={`${panelId}-tab-${tab.id}`}
            aria-selected={active}
            aria-controls={panelId}
            tabIndex={active ? 0 : -1}
            className={active ? "category active" : "category"}
            onClick={() => onSelect(tab.id)}
            onKeyDown={(event) => onKeyDown(event, index)}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
