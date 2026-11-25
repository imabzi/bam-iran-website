import type { Metadata } from "next";
import { EventDirectory } from "@/components/events/EventPages";

export const metadata: Metadata = {
  title: "Events",
  description: "Events and experiences from BAM Engineering Development Group.",
  alternates: { canonical: "/events" },
};

export default function EventsPage() {
  return <EventDirectory />;
}
