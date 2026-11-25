import type { Metadata } from "next";
import { AboutPage } from "@/components/company/CompanyPages";

export const metadata: Metadata = {
  title: "About BAM",
  description: "About BAM Engineering Development Group.",
  alternates: { canonical: "/about" },
};

export default function About() {
  return <AboutPage />;
}
