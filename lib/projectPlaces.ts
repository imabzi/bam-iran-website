import { resolveText, type Language } from "./i18n";
import type { Project } from "@/data/projects";

// Where projects appear on the archive map.
//
// Exact: a project with verified coordinates (`location.coordinates`) gets its
// own pin. Nothing else does: no position is ever inferred from a project name
// or address.
//
// Approximate: every other project with a recorded city or province is
// grouped on one marker for that place, drawn and labelled as approximate.
// The coordinates below are the public reference points of the cities and
// provinces themselves (city centres, a province's central area), not of any
// project. Add a place here when a project records a new city or province.

type Centre = { lat: number; lng: number; kind: "city" | "province" };

const centres: Record<string, Centre> = {
  "تهران": { lat: 35.6892, lng: 51.389, kind: "city" },
  "شیراز": { lat: 29.5918, lng: 52.5837, kind: "city" },
  "نوشهر": { lat: 36.6488, lng: 51.4961, kind: "city" },
  "چالوس": { lat: 36.655, lng: 51.4204, kind: "city" },
  "شهر جدید هشتگرد": { lat: 35.962, lng: 50.68, kind: "city" },
  "عسلویه": { lat: 27.4761, lng: 52.6074, kind: "city" },
  "مشکین‌شهر": { lat: 38.3983, lng: 47.6817, kind: "city" },
  "کیش": { lat: 26.5333, lng: 53.98, kind: "city" },
  "وین": { lat: 48.2082, lng: 16.3738, kind: "city" },
  "گیلان": { lat: 37.28, lng: 49.59, kind: "province" },
  "خراسان رضوی": { lat: 35.3, lng: 59.2, kind: "province" },
};

export type ExactPlace = { kind: "exact"; key: string; lat: number; lng: number; label: string; projects: Project[] };
export type AreaPlace = { kind: "area"; key: string; lat: number; lng: number; label: string; scope: "city" | "province"; projects: Project[] };
export type ProjectPlaces = { exact: ExactPlace[]; areas: AreaPlace[]; unplaced: Project[] };

// The Persian name of the project's city or province, as recorded.
function placeName(project: Project) {
  const location = project.location;
  return location?.city?.fa?.trim() || location?.province?.fa?.trim() || location?.addressFa?.split("،")[0]?.trim() || undefined;
}

export function projectPlaces(projects: Project[], language: Language): ProjectPlaces {
  const exact: ExactPlace[] = [];
  const areas = new Map<string, AreaPlace>();
  const unplaced: Project[] = [];

  for (const project of projects) {
    const location = project.location;
    const coordinates = location?.coordinates;
    if (coordinates && Number.isFinite(coordinates.lat) && Number.isFinite(coordinates.lng)) {
      const label = resolveText(location?.district, language)?.text ?? resolveText(location?.city, language)?.text ?? "";
      exact.push({ kind: "exact", key: project.code, lat: coordinates.lat, lng: coordinates.lng, label, projects: [project] });
      continue;
    }
    const name = placeName(project);
    const centre = name ? centres[name] : undefined;
    if (!name || !centre) {
      unplaced.push(project);
      continue;
    }
    const existing = areas.get(name);
    if (existing) existing.projects.push(project);
    else {
      const label =
        resolveText(location?.city, language)?.text ??
        resolveText(location?.province, language)?.text ??
        (language === "en" ? undefined : name) ??
        name;
      areas.set(name, { kind: "area", key: name, lat: centre.lat, lng: centre.lng, label, scope: centre.kind, projects: [project] });
    }
  }
  return { exact, areas: [...areas.values()].sort((a, b) => b.projects.length - a.projects.length), unplaced };
}
