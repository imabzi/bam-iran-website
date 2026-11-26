"use client";

import { useId, useState } from "react";
import { featuredArchitects } from "@/data/architects";
import { homepageEvents, pastEvents, upcomingEvents, visibleEvents } from "@/data/events";
import { useLanguage, useNow } from "@/lib/usePreferences";
import { ArchitectCard } from "../ArchitectCard";
import type { ArtworkVariant } from "../ArchitectVectorArtwork";
import { DragCarousel } from "../DragCarousel";
import { EventCard } from "../EventCard";
import { EventCategoryTabs, type EventTab } from "../events/EventTabs";
import { homepageJournalSlides, JournalSlider } from "../journal/JournalSlider";
import { SectionHeading, TextLink } from "../ui";

export function ArchitectsPreview() {
  const { t } = useLanguage();
  const list = featuredArchitects().slice(0, 3);
  if (list.length === 0) return null;

  return (
    <section className="section section-inverse home-architects" aria-labelledby="architects-title">
      <div className="container">
        <SectionHeading
          id="architects-title"
          title={t.architectsTitle}
          action={<TextLink href="/architects">{t.architectsAll}</TextLink>}
        />
        <div className="architect-rail">
          {list.map((architect, index) => (
            // Architectural line drawings stand in for portraits on the homepage.
            <ArchitectCard key={architect.id} architect={architect} artwork={(index % 3) as ArtworkVariant} />
          ))}
        </div>
      </div>
    </section>
  );
}

// Always shown. While demonstration content is on (lib/demo.ts) the clearly
// labelled sample events (data/demo) fill it; otherwise only real published
// events appear, and while there are none the heading and tabs stay with a
// localized empty state.
export function EventsPreview() {
  const { t } = useLanguage();
  const now = useNow();
  const panelId = useId();
  const [tab, setTab] = useState<EventTab>("all");
  const available = visibleEvents(now);

  // Every visible event in the tab. Before the time is known (first render),
  // only the unfiltered list is shown.
  const list =
    now === null
      ? tab === "all" ? available : []
      : tab === "past"
        ? pastEvents(available, now)
        : tab === "upcoming"
          ? upcomingEvents(available, now)
          : homepageEvents(available, now, Infinity);
  const empty = tab === "past" ? t.eventsEmptyPast : tab === "upcoming" ? t.eventsEmptyUpcoming : t.eventsEmpty;

  return (
    <section className="section home-events" aria-labelledby="events-title">
      <div className="container">
        <SectionHeading id="events-title" title={t.eventsTitle} action={<TextLink href="/events">{t.eventsAll}</TextLink>} />
        <div className="home-filter">
          <EventCategoryTabs selected={tab} onSelect={setTab} panelId={panelId} />
        </div>
        <div id={panelId} role="tabpanel" aria-labelledby={`${panelId}-tab-${tab}`} className="event-panel" tabIndex={0}>
          {list.length === 0 ? (
            <p className="empty-state event-panel-empty">{empty}</p>
          ) : (
            // Keyed by tab, so a new tab starts again from the first column.
            <div className="carousel-fade" key={tab}>
              <DragCarousel label={t.eventsTitle}>
                {list.map((event) => (
                  <EventCard key={event.id} event={event} now={now} sizes="(max-width: 767px) 86vw, (max-width: 1760px) 48vw, 820px" />
                ))}
              </DragCarousel>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// An editorial slider, one article at a time. See components/journal/JournalSlider.tsx.
export function JournalPreview() {
  const { t } = useLanguage();
  const slides = homepageJournalSlides();
  if (slides.length === 0) return null;

  return (
    <section className="section home-journal" aria-labelledby="journal-title">
      <div className="container">
        <SectionHeading id="journal-title" title={t.journalTitle} action={<TextLink href="/journal">{t.journalAll}</TextLink>} />
        <JournalSlider slides={slides} />
      </div>
    </section>
  );
}
