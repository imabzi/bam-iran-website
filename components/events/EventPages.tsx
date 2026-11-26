"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { getArchitect } from "@/data/architects";
import { eventTiming, visibleEvents, type BamEvent } from "@/data/events";
import { getProjectByCode, type Project } from "@/data/projects";
import { formatTime, resolveText, textOf } from "@/lib/i18n";
import { useDocumentTitle, useLanguage, useNow } from "@/lib/usePreferences";
import { ArrowIcon } from "../ArrowIcon";
import { EventCard, eventDateRange, timingLabel } from "../EventCard";
import { Header } from "../Header";
import { SiteFooter } from "../SiteFooter";
import { LocalizedText } from "../Text";
import { DemoBadge, PageIntro, SectionHeading, TextLink } from "../ui";
import { ProjectImage } from "../ProjectMedia";

type Filter = "all" | "upcoming" | "past";

export function EventDirectory() {
  const { t } = useLanguage();
  const now = useNow();
  const [filter, setFilter] = useState<Filter>("all");
  useDocumentTitle(`${t.eventsPageTitle} — ${t.brand}`);

  const all = visibleEvents(now);
  const isPast = (event: BamEvent) => now !== null && eventTiming(event, now) === "past";
  const upcoming = all.filter((event) => !isPast(event)).sort((a, b) => a.startsAt.localeCompare(b.startsAt));
  const past = all.filter(isPast).sort((a, b) => b.startsAt.localeCompare(a.startsAt));
  const groups = [
    { id: "upcoming" as const, title: t.eventsUpcoming, list: upcoming },
    { id: "past" as const, title: t.eventsPast, list: past },
  ].filter((group) => filter === "all" || group.id === filter);
  const hasDemo = all.some((event) => event.demo);

  return (
    <>
      <Header />
      <main id="main" className="inner-page">
        <PageIntro title={t.eventsPageTitle}>
          {hasDemo && <p className="demo-notice"><DemoBadge label={t.demoBadge} /> {t.demoNotice}</p>}
        </PageIntro>

        {all.length === 0 ? (
          <section className="container section-tight">
            <p className="empty-state">{t.eventsEmpty}</p>
          </section>
        ) : (
          <section className="container section-tight">
            <div className="filter-bar">
              <div className="category-filter" role="group" aria-label={t.eventsFilterLabel}>
                {([
                  ["all", t.eventsAll],
                  ["upcoming", t.eventsUpcoming],
                  ["past", t.eventsPast],
                ] as const).map(([id, label]) => (
                  <button key={id} type="button" className={id === filter ? "category active" : "category"} aria-pressed={id === filter} onClick={() => setFilter(id)}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
            {groups.map((group) => (
              <div className="event-group" key={group.id}>
                <h2 className="group-title">{group.title}</h2>
                {group.list.length === 0 ? (
                  <p className="empty-state empty-state-small">{t.eventsEmptyFiltered}</p>
                ) : (
                  <div className="event-grid event-archive-grid">
                    {group.list.map((event) => (
                      <EventCard key={event.id} event={event} now={now} />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </section>
        )}
      </main>
      <SiteFooter />
    </>
  );
}

function RelatedProjectCard({ project }: { project: Project }) {
  const { language } = useLanguage();
  const cover = project.images.card ?? project.images.cover;
  return (
    <Link href={`/projects/${project.slug}`} className="credit-card">
      <div className="credit-media">
        <ProjectImage src={cover} alt="" sizes="(max-width: 700px) 100vw, 25vw" className="credit-image" caption={false} />
      </div>
      <LocalizedText as="h3" className="credit-title" value={project.title} language={language} />
      <LocalizedText as="p" className="credit-meta" value={project.category} language={language} />
    </Link>
  );
}

export function EventDetail({ event }: { event: BamEvent }) {
  const { language, t } = useLanguage();
  const now = useNow();
  const title = textOf(event.title, language) ?? event.title.en ?? "";
  useDocumentTitle(`${title} — ${t.brand}`);
  const timing = now === null ? undefined : eventTiming(event, now);
  const isPast = timing === "past";
  const projects = (event.projectCodes ?? []).map(getProjectByCode).filter((project): project is Project => Boolean(project));
  const architects = (event.architectIds ?? []).map(getArchitect).filter((architect) => architect !== undefined);
  const location = event.location && resolveText(event.location.name, language);

  const gallery = event.gallery && event.gallery.length > 0 && (
    <section className="container section-tight" aria-labelledby="event-photos">
      <SectionHeading id="event-photos" title={t.eventPhotos} />
      <div className="project-gallery">
        {event.gallery.map((image, index) => (
          <div className="gallery-card" key={image.src}>
            <Image
              src={image.src}
              alt={textOf(image.alt, language) ?? `${title} — ${index + 1}`}
              width={image.width ?? 1600}
              height={image.height ?? 1200}
              sizes="(max-width: 580px) 100vw, 50vw"
            />
          </div>
        ))}
      </div>
    </section>
  );

  const videos = event.videos && event.videos.length > 0 && (
    <section className="container section-tight" aria-labelledby="event-videos">
      <SectionHeading id="event-videos" title={t.eventVideos} />
      <div className="video-grid">
        {event.videos.map((video) => (
          <figure key={video.url} className="video-card">
            <video controls preload="none" poster={video.poster} src={video.url} />
            {video.title && <LocalizedText as="figcaption" className="media-caption" value={video.title} language={language} />}
          </figure>
        ))}
      </div>
    </section>
  );

  return (
    <>
      <Header />
      <main id="main" className="inner-page">
        <section className="container detail-head">
          <Link href="/events" className="back-link">
            <ArrowIcon />
            <span>{t.eventsPageTitle}</span>
          </Link>
          <p className="event-details">
            {timing && <span className={`event-status event-status-${timing}`}>{timingLabel(timing, t)}</span>}
            {event.demo && <DemoBadge label={t.demoBadge} title={t.demoNotice} />}
          </p>
          <LocalizedText as="h1" className="page-title" value={event.title} language={language} />
          {event.demo && <p className="demo-notice">{t.demoNotice}</p>}
        </section>

        {event.cover && (
          <div className="container">
            <div className="detail-cover">
              <Image src={event.cover.src} alt={title} fill priority sizes="(max-width: 1760px) 100vw, 1680px" className="detail-cover-image" />
            </div>
          </div>
        )}

        <section className="container event-overview">
          <dl className="event-facts">
            <div className="fact">
              <dt>{t.eventDate}</dt>
              <dd>{eventDateRange(event, language)}</dd>
            </div>
            {!isPast && formatTime(event.startsAt, language) && (
              <div className="fact">
                <dt>{t.eventTime}</dt>
                <dd>
                  {formatTime(event.startsAt, language)}
                  {event.endsAt && ` – ${formatTime(event.endsAt, language)}`}
                </dd>
              </div>
            )}
            {location && (
              <div className="fact">
                <dt>{t.eventLocation}</dt>
                <dd lang={location.lang !== language ? location.lang : undefined}>
                  {event.location?.googleMapsUrl ? (
                    <a href={event.location.googleMapsUrl} target="_blank" rel="noopener noreferrer">{location.text}</a>
                  ) : (
                    location.text
                  )}
                </dd>
              </div>
            )}
          </dl>
          <div className="event-description">
            {event.description?.map((paragraph, index) => (
              <LocalizedText key={index} as="p" value={paragraph} language={language} />
            ))}
            {!isPast && event.registrationUrl && (
              <div className="event-registration">
                <h2 className="group-title">{t.eventRegistration}</h2>
                <a className="button" href={event.registrationUrl} target="_blank" rel="noopener noreferrer">
                  {t.eventRegister}
                </a>
                <p className="fine-print">{t.eventRegisterNote}</p>
              </div>
            )}
          </div>
        </section>

        {/* After an event, its photographs and videos lead. */}
        {isPast && gallery}
        {isPast && videos}

        {event.speakers && event.speakers.length > 0 && (
          <section className="container section-tight" aria-labelledby="event-speakers">
            <SectionHeading id="event-speakers" title={t.eventSpeakers} />
            <ul className="speaker-list">
              {event.speakers.map((speaker, index) => {
                const name = <LocalizedText value={speaker.name} language={language} />;
                return (
                  <li key={index}>
                    <span className="speaker-name">
                      {speaker.architectId ? <Link href={`/architects/${speaker.architectId}`}>{name}</Link> : name}
                    </span>
                    <LocalizedText className="speaker-role" value={speaker.role} language={language} />
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        {architects.length > 0 && (
          <section className="container section-tight" aria-labelledby="event-architects">
            <SectionHeading id="event-architects" title={t.relatedArchitects} />
            <ul className="link-list">
              {architects.map((architect) => (
                <li key={architect.id}>
                  <TextLink href={`/architects/${architect.id}`}>{textOf(architect.name, language) ?? architect.name.en}</TextLink>
                </li>
              ))}
            </ul>
          </section>
        )}

        {!isPast && gallery}
        {!isPast && videos}

        {projects.length > 0 && (
          <section className="container section-tight" aria-labelledby="event-projects">
            <SectionHeading id="event-projects" title={t.relatedProjects} />
            <ul className="credit-list">
              {projects.map((project) => (
                <li key={project.code}>
                  <RelatedProjectCard project={project} />
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
