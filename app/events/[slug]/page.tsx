import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EventDetail } from "@/components/events/EventPages";
import { events, getEvent } from "@/data/events";

type Props = { params: Promise<{ slug: string }> };

// Only events in the data exist. Sample events (development only) are never
// part of a production build, so their URLs return 404 there.
export const dynamicParams = false;

export function generateStaticParams() {
  return events.map((event) => ({ slug: event.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = getEvent(slug);
  if (!event) return {};
  return {
    title: event.title.en ?? event.title.fa,
    alternates: { canonical: `/events/${event.slug}` },
    // Demonstration content is never indexed.
    robots: event.demo ? { index: false, follow: false } : undefined,
  };
}

export default async function EventPage({ params }: Props) {
  const { slug } = await params;
  const event = getEvent(slug);
  if (!event) notFound();
  return <EventDetail event={event} />;
}
