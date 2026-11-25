"use client";

import Image from "next/image";
import Link from "next/link";
import { architectBio, architectContact, architects, projectsForArchitect, type Architect } from "@/data/architects";
import { events } from "@/data/events";
import { resolveText } from "@/lib/i18n";
import { useDocumentTitle, useLanguage, useNow } from "@/lib/usePreferences";
import { ArchitectCard } from "../ArchitectCard";
import { ArchitectPortrait } from "../ArchitectPortrait";
import { ArrowIcon } from "../ArrowIcon";
import { ContactLinks } from "../ContactLinks";
import { EventCard } from "../EventCard";
import { Header } from "../Header";
import { roleLabel } from "../ProjectInformation";
import { SiteFooter } from "../SiteFooter";
import { LocalizedText, Ltr, telHref } from "../Text";
import { DemoBadge, PageIntro, SectionHeading } from "../ui";

export function ArchitectDirectory() {
  const { t } = useLanguage();
  useDocumentTitle(`${t.architectsTitle} — ${t.brand}`);

  return (
    <>
      <Header />
      <main id="main" className="inner-page">
        <PageIntro title={t.architectsTitle} />
        <section className="container section-tight">
          <div className="architect-grid">
            {architects.map((architect, index) => (
              <ArchitectCard key={architect.id} architect={architect} seed={index} />
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

export function ArchitectProfile({ architect }: { architect: Architect }) {
  const { language, t } = useLanguage();
  const now = useNow();
  const name = resolveText(architect.name, language);
  useDocumentTitle(`${name?.text ?? architect.name.en} — ${t.brand}`);
  const credited = projectsForArchitect(architect.id);
  const roles = Array.from(new Set(credited.map((item) => item.role)));
  const bio = architectBio(architect);
  const longBio = resolveText(bio.long, language);
  const channels = architectContact(architect);
  const seed = Math.max(0, architects.findIndex((item) => item.id === architect.id));
  const relatedEvents = events.filter(
    (event) => event.architectIds?.includes(architect.id) || event.speakers?.some((speaker) => speaker.architectId === architect.id)
  );

  return (
    <>
      <Header />
      <main id="main" className="inner-page">
        {/* Text on the left and portrait on the right in every language: the
            grid is laid out left-to-right, and each column keeps the page direction. */}
        <section className="container profile-head" aria-labelledby="architect-name">
          <div className="profile-copy">
            <Link href="/architects" className="back-link">
              <ArrowIcon />
              <span>{t.architectsTitle}</span>
            </Link>
            <span className="kicker">{t.architectProfile}</span>
            {name && (
              <h1 id="architect-name" className="page-title profile-name" lang={name.lang !== language ? name.lang : undefined}>
                {name.text}
              </h1>
            )}
            <p className="profile-role">
              {architect.kind === "practice" ? t.architectFirm : roles.map((role) => roleLabel(role, t)).join(t.listSeparator)}
              {architect.base && (
                <>
                  <span className="meta-dot" aria-hidden="true" />
                  <LocalizedText value={architect.base} language={language} />
                </>
              )}
            </p>

            {longBio && (
              <div className="profile-bio" lang={longBio.lang !== language ? longBio.lang : undefined}>
                {bio.longIsSample && (
                  <p className="profile-sample">
                    <DemoBadge label={t.sampleText} /> {t.sampleTextNote}
                  </p>
                )}
                {longBio.text.split(/\n\s*\n/).map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            )}

            {architect.studio && (
              <div className="profile-studio">
                <span className="kicker">{t.architectStudio}</span>
                <LocalizedText as="p" className="profile-studio-name" value={architect.studio.name} language={language} />
                <LocalizedText as="p" value={architect.studio.address} language={language} />
                {architect.studio.phones && (
                  <p>
                    {architect.studio.phones.map((phone, index) => (
                      <span key={phone}>
                        {index > 0 && " · "}
                        <a href={telHref(phone)}><Ltr>{phone}</Ltr></a>
                      </span>
                    ))}
                  </p>
                )}
                {architect.studio.email && (
                  <p><a href={`mailto:${architect.studio.email}`}><Ltr>{architect.studio.email}</Ltr></a></p>
                )}
              </div>
            )}

            <ContactLinks className="profile-contact" order={["phone", "email", "website", "instagram", "linkedin"]} channels={channels} />
          </div>

          <div className="profile-media">
            <ArchitectPortrait architect={architect} seed={seed} priority sizes="(max-width: 900px) 100vw, 40vw" alt={name?.text ?? ""} />
          </div>
        </section>

        {credited.length > 0 && (
          <section className="container section-tight profile-projects" aria-labelledby="architect-projects">
            <SectionHeading id="architect-projects" title={t.bamProjects} />
            <ul className="credit-list">
              {credited.map(({ project, role }) => {
                const cover = project.images.card ?? project.images.cover;
                return (
                  <li key={project.code}>
                    <Link href={`/projects/${project.slug}`} className="credit-card">
                      <div className="credit-media">
                        {cover && <Image src={cover} alt="" fill sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 25vw" className="credit-image" />}
                      </div>
                      <LocalizedText as="h3" className="credit-title" value={project.title} language={language} />
                      <p className="credit-meta">
                        <LocalizedText value={project.category} language={language} />
                        <span className="meta-dot" aria-hidden="true" />
                        {roleLabel(role, t)}
                      </p>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        {relatedEvents.length > 0 && (
          <section className="container section-tight" aria-labelledby="architect-events">
            <SectionHeading id="architect-events" title={t.relatedEvents} />
            <div className="event-grid">
              {relatedEvents.map((event) => (
                <EventCard key={event.id} event={event} now={now} />
              ))}
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
