"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { creditsForProject, type ArchitectRole } from "@/data/architects";
import { projectStatuses, type AreaFact, type PartialLocalizedText, type Project, type ProjectLocation } from "@/data/projects";
import { formatNumber, resolveText, type ContentLanguage, type Dictionary, type Language } from "@/lib/i18n";
import { formatArea } from "@/lib/projectDisplay";
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
  const { facts, location, category, classification } = project;
  const area = (fact: AreaFact) => {
    const value = formatArea(project, fact, language, t);
    return value ? { value } : undefined;
  };
  const number = (value: number | undefined) => {
    const amount = count(value, language);
    return amount ? { value: amount } : undefined;
  };
  const list_ = (values: PartialLocalizedText[] | undefined) => {
    const resolved = (values ?? []).map((value) => resolveText(value, language)).filter((value) => value !== undefined);
    return resolved.length
      ? { value: resolved.map((value) => value.text).join(t.listSeparator), lang: resolved[0].lang !== language ? resolved[0].lang : undefined }
      : undefined;
  };
  const credits = creditFacts(project, language, t);
  const architectFact = credits.find((fact) => fact.label === t.factArchitect);
  const place = placeFor(location, language, t);
  const participants = (facts.participants ?? []).filter((value) => resolveText(value, language));
  const status = projectStatuses[project.status];
  // Province and city stand in for the approved address when there is none.
  // Completed archive projects keep their approved fact list unchanged.
  const showRegion = !place && project.status !== "completed";

  const list: Fact[] = [
    { label: t.factProjectType, ...text(category, language) },
    { label: t.factStatus, ...text(status, language) },
    { label: t.factClassification, ...text(classification, language) },
    { label: t.factLocation, ...place },
    ...(showRegion
      ? [
          { label: t.factProvince, ...text(location?.province, language) },
          { label: t.factCity, ...text(location?.city, language) },
        ]
      : []),
    { label: t.factUse, ...text(facts.use, language) },
    { label: t.factStartDate, ...text(facts.startDate, language, "en") },
    { label: t.factEstimatedCompletion, ...text(facts.estimatedCompletion, language, "en") },
    { label: t.factCompletionYear, ...text(facts.completionYear, language, "en") },
    { label: t.factSiteArea, ...area("siteArea") },
    { label: t.factBuiltUpArea, ...area("builtUpArea") },
    { label: t.factGrossFloorArea, ...area("grossFloorArea") },
    { label: t.factBuildings, ...number(facts.buildings) },
    { label: t.factFloors, ...number(facts.floors) },
    { label: t.factUnits, ...number(facts.units) },
    { label: t.factParking, ...number(facts.parking) },
    { label: t.factStructure, ...text(facts.structure, language) },
    { label: t.factFacade, ...text(facts.facade, language) },
    architectFact ?? { label: t.factArchitect, ...text(facts.architect, language) },
    ...credits.filter((fact) => fact !== architectFact),
    { label: t.factClient, ...text(facts.client, language) },
    { label: t.factOwner, ...text(facts.owner, language) },
    { label: t.factDeveloper, ...text(facts.developer, language) },
    { label: t.factBuilder, ...text(facts.builder, language) },
    { label: t.factContractor, ...text(facts.contractor, language) },
    { label: t.factConstructionManager, ...text(facts.constructionManager, language) },
    { label: t.factProjectManagement, ...text(facts.projectManagement, language) },
    { label: t.factParticipants(participants.length), ...list_(facts.participants) },
    { label: t.factPartners, ...list_(facts.partners) },
  ];
  return list.filter((fact) => Boolean(fact.value));
}

export function ProjectInformation({ project }: { project: Project }) {
  const { language, t } = useLanguage();
  const summary = resolveText(project.summary, language);
  const description = resolveText(project.description, language);
  const fallbackCopy = description ?? summary;

  return (
    <section className="project-overview">
      <div>
        <span className="section-kicker">{t.projectInformation}</span>
        {summary && (
          <p className="overview-lead" lang={summary.lang !== language ? summary.lang : undefined}>
            {summary.text}
          </p>
        )}
        {description && (
          <p className="overview-copy" lang={description.lang !== language ? description.lang : undefined}>
            {description.text}
          </p>
        )}
        {fallbackCopy && fallbackCopy.lang !== language && language === "ar" && (
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
