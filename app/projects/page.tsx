import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { ProjectArchive } from "@/components/ProjectArchive";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "BAM Architecture Archive",
  description: "The architectural archive of BAM Engineering Development Group: residential, commercial, medical, international and large-scale projects.",
  alternates: { canonical: "/projects" },
};

// The existing archive, unchanged in function: Visual and Index views, category
// filters and links to every project page at /projects/<slug>.
export default function ProjectsPage() {
  return (
    <>
      <Header />
      <main id="main">
        <ProjectArchive />
      </main>
      <SiteFooter />
    </>
  );
}
