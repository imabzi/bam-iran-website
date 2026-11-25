"use client";

import Image from "next/image";
import Link from "next/link";
import { eventTiming, type BamEvent, type EventTiming } from "@/data/events";
import { formatDate, textOf, type Dictionary, type Language } from "@/lib/i18n";
import { useLanguage } from "@/lib/usePreferences";
import { LocalizedText } from "./Text";
import { DemoBadge } from "./ui";

export function timingLabel(timing: EventTiming, t: Dictionary) {
  return { upcoming: t.eventsUpcoming, ongoing: t.eventsOngoing, past: t.eventsPast }[timing];
}

// "18 February 2027", or a range when the event spans several days.
export function eventDateRange(event: BamEvent, language: Language) {
  const start = formatDate(event.startsAt, language);
  if (!event.endsAt) return start;
  const end = formatDate(event.endsAt, language);
  return end && end !== start ? `${start} – ${end}` : start;
}

/**
 * An event card. The date leads: a large day numeral with month and year,
 * which sets events apart from the project and article cards. The image sits
 * above the text. The homepage carousel sets its own image ratio in CSS.
 */
export function EventCard({
  event,
  now,
  sizes = "(max-width: 767px) 100vw, (max-width: 1199px) 50vw, 25vw",
}: {
  event: BamEvent;
  now: number | null;
  sizes?: string;
}) {
  const { language, t } = useLanguage();
  const timing = now === null ? undefined : eventTiming(event, now);
  const title = textOf(event.title, language) ?? event.title.en ?? "";
  const day = formatDate(event.startsAt, language, { day: "numeric", month: undefined, year: undefined });
  const monthYear = formatDate(event.startsAt, language, { day: undefined });
  const multiDay = Boolean(event.endsAt) && eventDateRange(event, language) !== formatDate(event.startsAt, language);

  return (
    <Link href={`/events/${event.slug}`} className="event-card event-card-stacked" draggable={false}>
      <div className="event-media">
        {event.cover && (
          <Image
            src={event.cover.src}
            alt={title}
            fill
            sizes={sizes}
            draggable={false}
            className="event-image"
          />
        )}
        {event.demo && <DemoBadge label={t.demoBadge} title={t.demoNotice} />}
      </div>
      <div className="event-meta">
        <time className="event-date" dateTime={event.startsAt}>
          <span className="event-day">{day}</span>
          <span className="event-month">{monthYear}</span>
        </time>
        <div className="event-text">
          {timing && (
            <p className="event-details">
              <span className={`event-status event-status-${timing}`}>{timingLabel(timing, t)}</span>
            </p>
          )}
          {multiDay && <p className="event-range">{eventDateRange(event, language)}</p>}
          <LocalizedText as="h3" className="event-title" value={event.title} language={language} />
          {event.location && <LocalizedText as="p" className="event-location" value={event.location.name} language={language} />}
        </div>
      </div>
    </Link>
  );
}
