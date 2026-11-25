"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { creditsForProject, type ArchitectRole } from "@/data/architects";
import type { PartialLocalizedText, Project, ProjectLocation } from "@/data/projects";
import { formatNumber, resolveText, type ContentLanguage, type Dictionary, type Language } from "@/lib/i18n";
import { useLanguage } from "@/lib/usePreferences";

type Fact = { label: string; value?: ReactNode; lang?: Language };

function text(value: PartialLocalizedText | undefined, language: Language, arabicFallback: ContentLanguage = "fa") {
  const resolved = resolveText(value, language, arabicFallback);
  return resolved ? { value: resolved.text, lang: resolved.lang !== language ? resolved.lang : undefined } : undefined;
}

function count(value: number | undefined, language: Language) {
  return value !== undefined && Number.isFinite(value) && value > 0 ? formatNumber(value, language) : undefined;
}

// Only approved locations are shown. Persian (and Arabic, which shares its
// script) show the first two parts of the approved Persian address; English the
// existing short place name. The full address is for routing.
function placeFor(location: ProjectLocation | undefined, language: Language, t: Dictionary): Omit<Fact, "label"> | undefined {
  if (!location?.addressFa) return undefined;
  if (language !== "en") {
    return { value: location.addressFa.split("،").slice(0, 2).join("،"), lang: language === "ar" ? "fa" : undefined };
  }
  const parts = [location.district, location.city, location.country].map((part) => text(part, language)?.value).filter(Boolean);
  return parts.length ? { value: parts.join(t.listSeparator) } : undefined;
}

export function roleLabel(role: ArchitectRole, t: Dictionary) {
  return {
    "lead-architect": t.roleLeadArchitect,
    "interior-architect": t.roleInteriorArchitect,
    "design-consultant": t.roleDesignConsultant,
    "landscape-architect": t.roleLandscapeArchitect,
  }[role];
}

// Architect facts become links to the verified profiles in data/architects.ts.
// The linked names are the same verified names as the project's Architect fact.
function creditFacts(project: Project, language: Language, t: Dictionary): Fact[] {
  const credits = creditsForProject(project.code);
  const roles = Array.from(new Set(credits.map((credit) => credit.role)));
  return roles.map((role) => {
    const people = credits.filter((credit) => credit.role === role);
    return {
      label: role === "lead-architect" ? t.factArchitect : roleLabel(role, t),
      value: (
        <span className="fact-links">
          {people.map(({ architect }, index) => {
            const name = resolveText(architect.name, language);
            if (!name) return null;
            return (
              <span key={architect.id}>
                {index > 0 && t.listSeparator}
                <Link href={`/architects/${architect.id}`} lang={name.lang !== language ? name.lang : undefined}>
                  {name.text}
                </Link>
              </span>
            );
          })}
        </span>
      ),
    };
  });
}

function factsFor(project: Project, language: Language, t: Dictionary): Fact[] {
  const { facts, location, category } = project;
  const area = (value: number | undefined) => {
    const amount = count(value, language);
    return amount ? { value: `${amount} ${t.squareMeters}` } : undefined;
  };
  const number = (value: number | undefined) => {
    const amount = count(value, language);
    return amount ? { value: amount } : undefined;
  };
  const credits = creditFacts(project, language, t);
  const architectFact = credits.find((fact) => fact.label === t.factArchitect);

  const list: Fact[] = [
    { label: t.factProjectType, ...text(category, language) },
    { label: t.factLocation, ...placeFor(location, language, t) },
    { label: t.factCompletionYear, ...text(facts.completionYear, language, "en") },
    { label: t.factSiteArea, ...area(facts.siteArea) },
    { label: t.factBuiltUpArea, ...area(facts.builtUpArea) },
    { label: t.factGrossFloorArea, ...area(facts.grossFloorArea) },
    { label: t.factFloors, ...number(facts.floors) },
    { label: t.factUnits, ...number(facts.units) },
    { label: t.factBuildings, ...number(facts.buildings) },
    { label: t.factParking, ...number(facts.parking) },
    { label: t.factStructure, ...text(facts.structure, language) },
    { label: t.factFacade, ...text(facts.facade, language) },
    architectFact ?? { label: t.factArchitect, ...text(facts.architect, language) },
    ...credits.filter((fact) => fact !== architectFact),
    { label: t.factDeveloper, ...text(facts.developer, language) },
    { label: t.factContractor, ...text(facts.contractor, language) },
    { label: t.factStatus, ...text(facts.status, language) },
  ];
  return list.filter((fact) => Boolean(fact.value));
}

export function ProjectInformation({ project }: { project: Project }) {
  const { language, t } = useLanguage();
  const description = resolveText(project.description, language);

  return (
    <section className="project-overview">
      <div>
        <span className="section-kicker">{t.projectInformation}</span>
        {description && (
          <p className="overview-copy" lang={description.lang !== language ? description.lang : undefined}>
            {description.text}
          </p>
        )}
        {description && description.lang !== language && language === "ar" && (
          <p className="fallback-note">{t.originalInPersian}</p>
        )}
      </div>
      <dl className="facts-grid">
        {factsFor(project, language, t).map((fact) => (
          <div className="fact" key={fact.label}>
            <dt>{fact.label}</dt>
            <dd lang={fact.lang}>{fact.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
