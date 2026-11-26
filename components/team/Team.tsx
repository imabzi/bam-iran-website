"use client";

import Image from "next/image";
import Link from "next/link";
import { departments, publishedPeople, teamIntro, type Person } from "@/data/team";
import { getProjectByCode, projectTitle } from "@/data/projects";
import { resolveText, type Language, type ResolvedText } from "@/lib/i18n";
import { useDocumentTitle, useLanguage } from "@/lib/usePreferences";
import { Header } from "../Header";
import { SiteFooter } from "../SiteFooter";
import { TextLink } from "../ui";

function langAttr(text: ResolvedText | undefined, language: Language) {
  return text && text.lang !== language ? text.lang : undefined;
}

/**
 * A portrait, or until one is supplied a neutral placeholder in the same
 * frame: a drafted head-and-shoulders outline on a measured grid. Never a
 * crop from a magazine page.
 */
export function PersonPortrait({ person, sizes, priority = false }: { person: Person; sizes: string; priority?: boolean }) {
  const { language, t } = useLanguage();
  const name = resolveText(person.name, language);
  if (person.portrait) {
    return (
      <div className="person-portrait">
        <Image src={person.portrait.src} alt={name?.text ?? ""} fill sizes={sizes} priority={priority} className="person-image" style={{ objectPosition: person.portrait.position }} />
      </div>
    );
  }
  return (
    <div className="person-portrait is-placeholder">
      <svg viewBox="0 0 120 150" className="person-placeholder" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1">
        <path d="M0 50h120M0 100h120M40 0v150M80 0v150" opacity=".25" strokeDasharray="2 4" />
        <circle cx="60" cy="58" r="19" />
        <path d="M24 150c2-27 17-44 36-44s34 17 36 44" />
      </svg>
      <span className="person-placeholder-text">{t.portraitPending}</span>
    </div>
  );
}

function PersonText({ person, language, headingLevel, detailed }: { person: Person; language: Language; headingLevel: 2 | 3 | 4; detailed: boolean }) {
  const { t } = useLanguage();
  const name = resolveText(person.name, language);
  const title = resolveText(person.title, language);
  const bio = resolveText(person.bioShort, language);
  const quote = resolveText(person.quote, language);
  const note = person.affiliation === "magazine" ? resolveText(teamIntro.magazineNote, language) : undefined;
  const projects = (person.projectCodes ?? []).map(getProjectByCode).filter((project) => project !== undefined);
  const Heading = `h${headingLevel}` as "h2" | "h3" | "h4";
  if (!name) return null;
  return (
    <div className="person-text">
      <Heading className="person-name" lang={langAttr(name, language)}>{name.text}</Heading>
      {title && <p className="person-title" lang={langAttr(title, language)}>{title.text}</p>}
      {detailed && bio && <p className="person-bio" lang={langAttr(bio, language)}>{bio.text}</p>}
      {detailed && quote && <blockquote className="person-quote">{quote.text}</blockquote>}
      {detailed && projects.length > 0 && (
        <p className="person-projects">
          <span>{t.relatedProject}:</span>{" "}
          {projects.map((project, index) => (
            <span key={project.code}>
              {index > 0 && t.listSeparator}
              <Link href={`/projects/${project.slug}`}>{projectTitle(project, language)}</Link>
            </span>
          ))}
        </p>
      )}
      {note && <p className="person-source">{note.text}</p>}
    </div>
  );
}

/** Homepage preview: the featured people, linking to /team. */
export function TeamPreview() {
  const { language, t } = useLanguage();
  const title = resolveText(teamIntro.title, language);
  const kicker = resolveText(teamIntro.kicker, language);
  const featured = publishedPeople.filter((person) => person.featured && resolveText(person.name, language));
  if (!title || featured.length === 0) return null;
  const [lead, ...others] = featured;

  return (
    <section className="section team-preview" aria-labelledby="team-preview-title">
      <div className="container">
        <div className="section-heading">
          <div className="section-heading-copy">
            {kicker && <span className="kicker">{kicker.text}</span>}
            <h2 id="team-preview-title" className="section-title">{title.text}</h2>
          </div>
          <div className="section-heading-action hide-narrow"><TextLink href="/team">{t.teamAll}</TextLink></div>
        </div>
        <div className="team-preview-grid">
          <article className="person-feature">
            <PersonPortrait person={lead} sizes="(max-width: 900px) 100vw, 34vw" />
            <PersonText person={lead} language={language} headingLevel={3} detailed />
          </article>
          <ul className="team-preview-list">
            {others.slice(0, 3).map((person) => (
              <li key={person.id} className="person-card">
                <PersonPortrait person={person} sizes="(max-width: 900px) 50vw, 18vw" />
                <PersonText person={person} language={language} headingLevel={3} detailed={false} />
              </li>
            ))}
          </ul>
        </div>
        <div className="section-end show-narrow"><TextLink href="/team">{t.teamAll}</TextLink></div>
      </div>
    </section>
  );
}

/** The Team page: people grouped by department. */
export function TeamPage() {
  const { language, t } = useLanguage();
  useDocumentTitle(`${t.navTeam} — ${t.brand}`);
  const title = resolveText(teamIntro.title, language);
  const lead = resolveText(teamIntro.lead, language);
  const disclaimer = resolveText(teamIntro.magazineDisclaimer, language);
  const groups = departments
    .map((department) => ({
      ...department,
      people: publishedPeople.filter((person) => person.department === department.id && resolveText(person.name, language)),
    }))
    .filter((group) => group.people.length > 0);
  const hasMagazine = groups.some((group) => group.people.some((person) => person.affiliation === "magazine"));

  return (
    <>
      <Header />
      <main id="main" className="inner-page team-page">
        <section className="container page-intro">
          <span className="kicker">{t.navTeam}</span>
          <h1 className="page-title">{title?.text ?? t.navTeam}</h1>
          {lead && <div className="page-intro-body"><p className="page-lead">{lead.text}</p></div>}
        </section>

        {groups.map((group) => {
          const label = resolveText(group.label, language);
          const leadership = group.id === "leadership";
          return (
            <section key={group.id} className="container team-group" aria-labelledby={`team-${group.id}`}>
              <h2 id={`team-${group.id}`} className="team-group-title">{label?.text}</h2>
              {leadership ? (
                <div className="team-leaders">
                  {group.people.map((person) => (
                    <article key={person.id} className="person-feature person-feature-wide">
                      <PersonPortrait person={person} sizes="(max-width: 900px) 100vw, 36vw" priority />
                      <PersonText person={person} language={language} headingLevel={3} detailed />
                    </article>
                  ))}
                </div>
              ) : (
                <ul className="team-grid">
                  {group.people.map((person) => (
                    <li key={person.id} className="person-card">
                      <PersonPortrait person={person} sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 25vw" />
                      <PersonText person={person} language={language} headingLevel={3} detailed />
                    </li>
                  ))}
                </ul>
              )}
            </section>
          );
        })}

        {hasMagazine && disclaimer && (
          <section className="container team-note">
            <p>{disclaimer.text}</p>
          </section>
        )}
        <section className="container team-end">
          <TextLink href="/architects">{t.architectsAll}</TextLink>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
