import type { Metadata } from "next";
import { ArchitectDirectory } from "@/components/architects/ArchitectPages";

export const metadata: Metadata = {
  title: "Leading Architects",
  description: "Architects and design practices behind BAM projects.",
  alternates: { canonical: "/architects" },
};

export default function ArchitectsPage() {
  return <ArchitectDirectory />;
}
