import { demoContent } from "@/lib/demo";
import type { TextValue } from "@/lib/i18n";
import { demoEvents } from "./demo/events";

// BAM events.
//
// No real event has been supplied yet, so `publishedEvents` is empty. Add
// approved events here (or, later, through the CMS). Never add a fictional
// event to this list: sample records live in data/demo/events.ts and appear
// only while demonstration content is switched on in lib/demo.ts.

export type PublicationStatus = "draft" | "scheduled" | "published" | "archived";
export type EventTiming = "upcoming" | "ongoing" | "past";

export type EventSpeaker = {
  name: TextValue;
  role?: TextValue;
  architectId?: string; // Links to a profile in data/architects.ts.
};

export type EventMedia = { src: string; alt?: TextValue; width?: number; height?: number };
export type EventVideo = { url: string; title?: TextValue; poster?: string };

export type BamEvent = {
  id: string;
  slug: string;
  title: TextValue;
  summary?: TextValue;
  description?: TextValue[]; // Paragraphs.
  startsAt: string; // ISO 8601 with offset, e.g. "2027-02-18T17:00:00+03:30".
  endsAt?: string; // Defaults to the end of the start day.
  location?: { name: TextValue; address?: TextValue; googleMapsUrl?: string };
  cover?: EventMedia;
  gallery?: EventMedia[];
  videos?: EventVideo[];
  speakers?: EventSpeaker[];
  architectIds?: string[];
  projectCodes?: string[];
  // Only set when a real, working registration page exists.
  registrationUrl?: string;
  publication: PublicationStatus;
  publishAt?: string; // For scheduled publication.
  featured?: boolean;
  demo?: boolean; // Sample content: never shown in production.
};

export const publishedEvents: BamEvent[] = [];

function isLive(event: BamEvent, now: number) {
  if (event.publication === "published") return true;
  if (event.publication === "scheduled" && event.publishAt) return Date.parse(event.publishAt) <= now;
  return false;
}

// Every event a visitor may see, ignoring the time-based scheduled check
// (applied in `visibleEvents`, which runs on the client with the real time).
// The labelled sample events are included only while `demoContent.events`
// (lib/demo.ts) is on.
export const events: BamEvent[] = [
  ...publishedEvents,
  ...(demoContent.events ? demoEvents : []),
].filter((event) => event.publication === "published" || event.publication === "scheduled");

export function visibleEvents(now: number | null) {
  return events.filter((event) => (now === null ? event.publication === "published" : isLive(event, now)));
}

export function getEvent(slug: string) {
  return events.find((event) => event.slug === slug);
}

function endOf(event: BamEvent) {
  if (event.endsAt) return Date.parse(event.endsAt);
  const start = new Date(event.startsAt);
  // The end of the start day in Tehran (UTC+03:30).
  const tehran = new Date(start.getTime() + 3.5 * 3600_000);
  tehran.setUTCHours(23, 59, 59, 999);
  return tehran.getTime() - 3.5 * 3600_000;
}

export function eventTiming(event: BamEvent, now: number): EventTiming {
  const start = Date.parse(event.startsAt);
  if (now < start) return "upcoming";
  if (now <= endOf(event)) return "ongoing";
  return "past";
}

/**
 * The homepage "All Events" selection: upcoming and ongoing events first
 * (featured ones, then the nearest), followed by the most recent past events.
 * Returns at most `limit` events.
 */
export function homepageEvents(list: BamEvent[], now: number, limit = 4) {
  const current = upcomingEvents(list, now).sort(
    (a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)) || a.startsAt.localeCompare(b.startsAt)
  );
  return [...current, ...pastEvents(list, now)].slice(0, limit);
}

// Upcoming includes events in progress; both lists exclude nothing else.
export function upcomingEvents(list: BamEvent[], now: number) {
  return list.filter((event) => eventTiming(event, now) !== "past").sort((a, b) => a.startsAt.localeCompare(b.startsAt));
}

export function pastEvents(list: BamEvent[], now: number) {
  return list.filter((event) => eventTiming(event, now) === "past").sort((a, b) => b.startsAt.localeCompare(a.startsAt));
}
