import { getProjectByCode, hasPhotography, projects, type CategoryId, type Project } from "./projects";

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

// The order in which projects are preferred for Selected Projects. A category
// shows its curated projects first, then other photographed projects in the
// archive's own order, up to four.
export const featuredProjectCodes = [
  "R12", "R08", "R14", "T06", // All
  "R03", "R04",
  "T02", "T01",
  "H08", "H05", "H01",
  "I01", "I02", "I03",
  "M05", "M01", "M03",
];

export function selectedProjects(category: "all" | CategoryId, limit = 4): Project[] {
  const inCategory = (project: Project) => category === "all" || project.category.id === category;
  const curated = featuredProjectCodes
    .map(getProjectByCode)
    .filter((project): project is Project => Boolean(project && inCategory(project) && hasPhotography(project)));
  const rest = projects.filter((project) => inCategory(project) && hasPhotography(project) && !curated.includes(project));
  return [...curated, ...rest].slice(0, limit);
}

// The About preview photograph: BAM's own head office, with the BAM sign on its facade.
export const aboutImage = {
  projectCode: "T01",
  src: "/projects/bam-center-head-office/exterior/exterior-01.jpg",
  width: 2800,
  height: 1867,
  position: "50% 50%",
};
