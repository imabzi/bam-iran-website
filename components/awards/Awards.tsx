"use client";

import Link from "next/link";
import { awardsByYear, awardsIntro, featuredAwards, publishedAwards, type Award } from "@/data/awards";
import { getProjectByCode, projectTitle } from "@/data/projects";
import { formatNumber, resolveText, type Language } from "@/lib/i18n";
import { useDocumentTitle, useLanguage } from "@/lib/usePreferences";
import { Header } from "../Header";
import { SiteFooter } from "../SiteFooter";
import { Ltr } from "../Text";
import { TextLink } from "../ui";
import { AwardVisual } from "./AwardIcon";

function year(value: number | undefined, language: Language) {
  return value === undefined ? undefined : formatNumber(value, language, { useGrouping: false });
}

// The Solar Hijri year as published on the official Persian site.
function solarYear(value: string | undefined, language: Language) {
  return value && language !== "en" ? formatNumber(Number(value), language, { useGrouping: false }) : undefined;
}

function AwardText({ award, language, detailed, headingLevel }: { award: Award; language: Language; detailed: boolean; headingLevel: 3 | 4 }) {
  const { t } = useLanguage();
  const title = resolveText(award.title, language);
  const place = resolveText(award.place, language);
  const description = resolveText(award.description, language);
  const institution = resolveText(award.institution, language);
  const project = award.projectCode ? getProjectByCode(award.projectCode) : undefined;
  if (!title) return null;
  const Heading = headingLevel === 3 ? "h3" : "h4";
  return (
    <div className="award-text">
      <Heading className="award-title" lang={title.lang !== language ? title.lang : undefined}>{title.text}</Heading>
      {(place || institution) && (
        <p className="award-meta">{[institution?.text, place?.text].filter(Boolean).join(t.listSeparator)}</p>
      )}
      {description && <p className="award-description">{description.text}</p>}
      {detailed && language !== "en" && (
        <dl className="award-details">
          <div>
            <dt>{t.awardSourceTitle}</dt>
            <dd><Ltr><span lang="en">{award.sourceTitle}</span></Ltr></dd>
          </div>
          {award.officialFa && (
            <div>
              <dt>{t.awardOfficialName}</dt>
              <dd lang="fa">{award.officialFa}</dd>
            </div>
          )}
          {project && (
            <div>
              <dt>{t.relatedProject}</dt>
              <dd><Link href={`/projects/${project.slug}`}>{projectTitle(project, language)}</Link></dd>
            </div>
          )}
        </dl>
      )}
    </div>
  );
}

/** Homepage (and About) preview: the featured awards and the total, linking to /awards. */
export function AwardsPreview({ headingLevel = 2 }: { headingLevel?: 2 | 3 }) {
  const { language, t } = useLanguage();
  const title = resolveText(awardsIntro.title, language);
  const kicker = resolveText(awardsIntro.kicker, language);
  const list = featuredAwards.filter((award) => resolveText(award.title, language));
  if (!title || list.length === 0) return null;
  const Heading = headingLevel === 2 ? "h2" : "h3";
  const id = `awards-preview-${headingLevel}`;

  return (
    <section className="section awards-preview" aria-labelledby={id}>
      <div className="container awards-preview-grid">
        <div className="awards-preview-intro">
          {kicker && <span className="kicker">{kicker.text}</span>}
          <Heading id={id} className="section-title">{title.text}</Heading>
          <p className="awards-total">
            <span className="awards-total-number">{formatNumber(publishedAwards.length, language)}</span>
            <span className="awards-total-label">{t.awardsCountLabel}</span>
          </p>
          <TextLink href="/awards">{t.awardsAll}</TextLink>
        </div>
        <ol className="awards-preview-list">
          {list.map((award) => {
            const solar = solarYear(award.solarYear, language);
            return (
              <li key={award.id} className="award-row">
                <p className="award-row-year">
                  <span>{year(award.year, language)}</span>
                  {solar && <span className="award-solar">{solar}</span>}
                </p>
                <AwardVisual icon={award.icon} image={award.image} />
                <AwardText award={award} language={language} detailed={false} headingLevel={headingLevel === 2 ? 3 : 4} />
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

/** The Awards page: every published award, by year. */
export function AwardsPage() {
  const { language, t } = useLanguage();
  useDocumentTitle(`${t.navAwards} — ${t.brand}`);
  const title = resolveText(awardsIntro.title, language);
  const lead = resolveText(awardsIntro.lead, language);
  const groups = awardsByYear()
    .map((group) => ({ ...group, awards: group.awards.filter((award) => resolveText(award.title, language)) }))
    .filter((group) => group.awards.length > 0);
  const first = groups[0]?.year;
  const last = groups[groups.length - 1]?.year;

  return (
    <>
      <Header />
      <main id="main" className="inner-page awards-page">
        <section className="container awards-hero">
          <span className="kicker">{t.navAwards}</span>
          <h1 className="page-title">{title?.text ?? t.navAwards}</h1>
          <div className="awards-hero-row">
            {lead && <p className="page-lead">{lead.text}</p>}
            {first !== undefined && last !== undefined && (
              <p className="awards-span" aria-hidden="true">
                <span>{year(first, language)}</span>
                <span className="awards-span-line" />
                <span>{year(last, language)}</span>
              </p>
            )}
          </div>
        </section>

        <section className="container awards-archive" aria-label={t.navAwards}>
          {groups.length === 0 ? (
            <p className="empty-state">{t.projectsEmpty}</p>
          ) : (
            <ol className="awards-years">
              {groups.map((group) => {
                const solar = solarYear(group.awards[0]?.solarYear, language);
                return (
                  <li key={group.year} className="awards-year">
                    <h2 className="awards-year-label">
                      <span className="awards-year-number">{year(group.year, language)}</span>
                      {solar && <span className="award-solar">{solar}</span>}
                    </h2>
                    <ul className="awards-year-list">
                      {group.awards.map((award) => (
                        <li key={award.id} className="award-entry">
                          <AwardVisual icon={award.icon} image={award.image} />
                          <AwardText award={award} language={language} detailed headingLevel={3} />
                        </li>
                      ))}
                    </ul>
                  </li>
                );
              })}
            </ol>
          )}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
