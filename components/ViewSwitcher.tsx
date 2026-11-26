"use client";

import { useLanguage, useViewMode } from "@/lib/usePreferences";
import { GridIcon, ListIcon, MapIcon } from "./ViewIcons";

export function ViewSwitcher() {
  const { t } = useLanguage();
  const { view, setView } = useViewMode();

  const options = [
    { id: "visual", label: t.viewVisual, Icon: GridIcon },
    { id: "index", label: t.viewIndex, Icon: ListIcon },
    { id: "map", label: t.viewMap, Icon: MapIcon },
  ] as const;

  return (
    <div className="view-switcher" role="group" aria-label={t.viewLabel}>
      {options.map(({ id, label, Icon }) => (
        <button
          type="button"
          key={id}
          className={id === view ? "view-option active" : "view-option"}
          aria-label={label}
          aria-pressed={id === view}
          onClick={() => setView(id)}
        >
          <span className="view-option-icon"><Icon /></span>
          <span className="view-option-text">{label}</span>
        </button>
      ))}
    </div>
  );
}
