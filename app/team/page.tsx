import type { Metadata } from "next";
import { TeamPage } from "@/components/team/Team";

export const metadata: Metadata = {
  title: "The Team",
  description: "People of BAM Engineering Development Group.",
  alternates: { canonical: "/team" },
};

export default function Page() {
  return <TeamPage />;
}
