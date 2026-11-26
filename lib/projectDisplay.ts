import { projectStatuses, type AreaFact, type Project } from "@/data/projects";
import { formatNumber, resolveText, type Dictionary, type Language, type ResolvedText } from "./i18n";

// Shared wording for project cards and project pages. Every function returns
// undefined for a missing value, so callers hide the line rather than showing
// a dash, 0 or "undefined".

function positive(value: number | undefined): value is number {
  return value !== undefined && Number.isFinite(value) && value > 0;
}

// An area in the unit and precision it was supplied in: "۵۰ هکتار",
// "حدود ۲۵۰٬۰۰۰ مترمربع".
export function formatArea(project: Project, fact: AreaFact, language: Language, t: Dictionary) {
  const value = project.facts[fact];
  if (!positive(value)) return undefined;
  const display = project.facts.areaDisplay?.[fact];
  const amount = display?.unit === "ha"
    ? `${formatNumber(value / 10_000, language)} ${t.hectares}`
    : `${formatNumber(value, language)} ${t.squareMeters}`;
  return display?.approximate ? t.approximately(amount) : amount;
}

export function formatCount(value: number | undefined, language: Language) {
  return positive(value) ? formatNumber(value, language) : undefined;
}

// The one measurement a card shows: units, then built-up area, then land area.
export function primaryMeasurement(project: Project, language: Language, t: Dictionary) {
  const units = formatCount(project.facts.units, language);
  if (units) return t.unitsCount(units);
  return (
    formatArea(project, "builtUpArea", language, t) ??
    formatArea(project, "siteArea", language, t) ??
    formatArea(project, "grossFloorArea", language, t)
  );
}

// A short place name for cards. Persian and Arabic use the first two parts of
// the approved Persian address; otherwise the recorded district, city and
// province. The country alone is not shown.
export function shortPlace(project: Project, language: Language, t: Dictionary): ResolvedText | undefined {
  const location = project.location;
  if (!location) return undefined;
  if (location.addressFa && language !== "en") {
    return { text: location.addressFa.split("،").slice(0, 2).join("،").trim(), lang: "fa" };
  }
  const parts = [location.district, location.city, location.province]
    .map((part) => resolveText(part, language))
    .filter((part): part is ResolvedText => part !== undefined);
  if (parts.length === 0) return undefined;
  return { text: parts.slice(0, 2).map((part) => part.text).join(t.listSeparator), lang: parts[0].lang };
}

// The category label, or the development classification when one is recorded.
export function projectKicker(project: Project, language: Language) {
  return resolveText(project.classification, language) ?? resolveText(project.category, language);
}

export function statusLabel(project: Project, language: Language) {
  return resolveText(projectStatuses[project.status], language)?.text ?? projectStatuses[project.status].fa;
}
