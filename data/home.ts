import type { Language } from "@/lib/i18n";
import { getProjectByCode, hasPhotography, isListedIn, projects, type Project, type ProjectStatus } from "./projects";

// Homepage curation. Every image is an existing BAM photograph from the project
// archive; nothing here adds or changes project facts.

export type HeroSlide = {
  projectCode: string;
  src: string;
  width: number;
  height: number;
  // Where the crop is anchored, on wide screens and on tall phone screens.
  position: string;
  mobilePosition: string;
};

// Up to three projects. Chosen for resolution (2800px), a clear view of the
// building and calm areas for the title near the bottom of the frame.
export const heroSlides: HeroSlide[] = [
  { projectCode: "T09", src: "/projects/bamland/exterior/exterior-02.jpg", width: 2800, height: 1867, position: "50% 58%", mobilePosition: "68% 50%" },
  { projectCode: "R09", src: "/projects/bam-choobineh/exterior/exterior-01.jpg", width: 2800, height: 1471, position: "50% 45%", mobilePosition: "46% 50%" },
  { projectCode: "R13", src: "/projects/bam-simindokht/exterior/exterior-02.jpg", width: 2800, height: 1867, position: "50% 40%", mobilePosition: "40% 50%" },
];

// The order in which completed projects are preferred in the homepage
// Projects section: these curated projects first, then other photographed
// projects in the archive's own order, then the rest. This only orders the
// list: a project without photographs is never left out.
export const featuredProjectCodes = [
  "R12", "R08", "R14", "T06",
  "R03", "R04",
  "T02", "T01",
  "H08", "H05", "H01",
  "I01", "I02", "I03",
  "M05", "M01", "M03",
];

// Every listed project with this status, for the homepage tabs. Ongoing and
// negotiation projects keep the data order.
export function homepageProjects(status: ProjectStatus, language: Language): Project[] {
  const listed = projects.filter((project) => project.status === status && isListedIn(project, language));
  if (status !== "completed") return listed;
  const curated = featuredProjectCodes
    .map(getProjectByCode)
    .filter((project): project is Project => Boolean(project && listed.includes(project) && hasPhotography(project)));
  const photographed = listed.filter((project) => hasPhotography(project) && !curated.includes(project));
  const others = listed.filter((project) => !hasPhotography(project));
  return [...curated, ...photographed, ...others];
}

// The About preview photograph: BAM's own head office, with the BAM sign on its facade.
export const aboutImage = {
  projectCode: "T01",
  src: "/projects/bam-center-head-office/exterior/exterior-01.jpg",
  width: 2800,
  height: 1867,
  position: "50% 50%",
};
