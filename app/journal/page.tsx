import type { Metadata } from "next";
import { ArticleDirectory } from "@/components/journal/JournalPages";

export const metadata: Metadata = {
  title: "BAM Journal",
  description: "News and stories from BAM Engineering Development Group.",
  alternates: { canonical: "/journal" },
};

export default function JournalPage() {
  return <ArticleDirectory />;
}
