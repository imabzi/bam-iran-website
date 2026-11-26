import { demoContent } from "@/lib/demo";
import type { TextValue } from "@/lib/i18n";
import { demoArchitectBios } from "./demo/architectBios";
import { getProjectByCode, projects, type Project } from "./projects";

// Sample biographies (data/demo/architectBios.ts). Development only: they are
// not part of the public design review. See `demoContent` in lib/demo.ts.
const demoBios: Record<string, { bioShort?: TextValue; bioLong?: TextValue }> =
  demoContent.architectBios ? demoArchitectBios : {};

// Architects and design professionals connected with BAM projects.
//
// Only verified relationships are recorded. Every credit below repeats a fact
// already published in data/projectContent.ts (the `architect` fact or the
// project description), whose source PROJECT_RESEARCH_REPORT.md records. Do not
// add a credit, biography, achievement or portrait without a verified source.

export type ArchitectRole = "lead-architect" | "interior-architect" | "design-consultant" | "landscape-architect";

export type Architect = {
  id: string; // Stable id, also the URL slug.
  kind: "person" | "practice";
  name: TextValue; // Verified spelling in each available language.
  base?: TextValue; // Country or city of a practice, when verified.
  // Approved biographies only. A short one for cards (two or three lines) and a
  // longer one for the profile; paragraphs in bioLong are separated by blank lines.
  bioShort?: TextValue;
  bioLong?: TextValue;
  achievements?: TextValue[]; // Only verified achievements.
  // A professional portrait of the architect personally (never a project photo).
  // None has been supplied, so cards and profiles show a vector placeholder.
  portrait?: { src: string; width: number; height: number; position?: string };
  // A photograph of one of this architect's own credited projects. Not used as
  // a portrait; kept for reference and for future use.
  representativeImage: { projectCode: string; src: string; position?: string };
  // Personal or practice contact channels. Only verified values; a missing
  // field hides its icon. Studio phone and email are read from `studio`.
  contact?: { phone?: string; email?: string; website?: string; instagram?: string; linkedin?: string };
  studio?: {
    name: TextValue;
    address?: TextValue;
    phones?: string[];
    email?: string;
    source: string;
  };
  featured?: boolean; // Shown on the homepage, in this file's order.
};

export type ProjectCredit = {
  projectCode: string;
  architectId: string;
  role: ArchitectRole;
  source: string;
};

export const architects: Architect[] = [
  {
    id: "farzad-daliri",
    kind: "person",
    name: { en: "Farzad Daliri", fa: "فرزاد دلیری" },
    representativeImage: {
      projectCode: "T02",
      src: "/projects/bam-center-farmanieh/exterior/exterior-02.jpg",
      position: "62% 50%",
    },
    // As listed on BAM's contact page, https://bamgroup.ir/ارتباط-با-ما/ and /en/contact-us/.
    studio: {
      name: { en: "Daliri Architecture Atelier", fa: "دفتر مهندس فرزاد دلیری" },
      address: {
        en: "8nd Floor, No. 5, North Vatanpour Alley, Andarzgoo Blvd, Tehran, Iran",
        fa: "تهران، بلوار اندرزگو، خیابان وطن پور شمالی ،پلاک 5، طبقه 8",
      },
      phones: ["021-22395087", "021-22395083"],
      email: "farzad.daliri@yahoo.com",
      source: "bamgroup.ir contact page",
    },
    featured: true,
  },
  {
    id: "morteza-adib",
    kind: "person",
    name: { en: "Morteza Adib", fa: "مرتضی ادیب" },
    representativeImage: { projectCode: "T09", src: "/projects/bamland/exterior/exterior-04.jpg", position: "45% 50%" },
    featured: true,
  },
  {
    id: "maryam-yousefi",
    kind: "person",
    name: { en: "Maryam Yousefi", fa: "مریم یوسفی" },
    representativeImage: { projectCode: "T09", src: "/projects/bamland/exterior/exterior-07.jpg", position: "60% 50%" },
    featured: true,
  },
  {
    id: "erga",
    kind: "practice",
    name: { en: "ERGA", fa: "ارگا" },
    base: { en: "Lebanon", fa: "لبنان" },
    representativeImage: { projectCode: "H03", src: "/projects/national-cancer-center/exterior/exterior-01.jpg", position: "40% 50%" },
  },
];

const research = "PROJECT_RESEARCH_REPORT.md";

export const projectCredits: ProjectCredit[] = [
  ...["R01", "R09", "R18", "T01", "T02", "T03", "T06", "T12", "T14"].map((projectCode) => ({
    projectCode,
    architectId: "farzad-daliri",
    role: "lead-architect" as const,
    source: projectCode === "T12" || projectCode === "T14" ? "BAM_Archive_Content_Update_Report_FA.md" : research,
  })),
  { projectCode: "T09", architectId: "morteza-adib", role: "lead-architect", source: research },
  { projectCode: "T09", architectId: "maryam-yousefi", role: "lead-architect", source: research },
  // "ERGA of Lebanon is the main architectural consultant" — National Cancer Center description.
  { projectCode: "H03", architectId: "erga", role: "design-consultant", source: research },
];

export function getArchitect(id: string) {
  return architects.find((architect) => architect.id === id);
}

export function featuredArchitects() {
  return architects.filter((architect) => architect.featured);
}

export function creditsForProject(projectCode: string) {
  return projectCredits
    .filter((credit) => credit.projectCode === projectCode)
    .flatMap((credit) => {
      const architect = getArchitect(credit.architectId);
      return architect ? [{ ...credit, architect }] : [];
    });
}

export function projectsForArchitect(architectId: string): Array<{ project: Project; role: ArchitectRole }> {
  // Keep the archive's own project order.
  return projects.flatMap((project) => {
    const credit = projectCredits.find((item) => item.architectId === architectId && item.projectCode === project.code);
    return credit ? [{ project, role: credit.role }] : [];
  });
}

// Approved biography first; in development previews only, a sample text that the
// interface marks as such.
export function architectBio(architect: Architect) {
  const sample = demoBios[architect.id];
  return {
    short: architect.bioShort ?? sample?.bioShort,
    long: architect.bioLong ?? sample?.bioLong,
    shortIsSample: !architect.bioShort && Boolean(sample?.bioShort),
    longIsSample: !architect.bioLong && Boolean(sample?.bioLong),
  };
}

// The number of distinct BAM projects credited to the architect, from
// projectCredits. A project credited twice (two roles) counts once.
export function bamProjectCount(architectId: string) {
  return new Set(projectCredits.filter((credit) => credit.architectId === architectId).map((credit) => credit.projectCode)).size;
}

// Contact channels for the profile: verified personal fields first, then the
// studio phone and email already on record (shown, not duplicated in the data).
export function architectContact(architect: Architect) {
  return {
    phone: architect.contact?.phone ?? architect.studio?.phones?.[0],
    email: architect.contact?.email ?? architect.studio?.email,
    website: architect.contact?.website,
    instagram: architect.contact?.instagram,
    linkedin: architect.contact?.linkedin,
  };
}

export function representativeProject(architect: Architect) {
  return getProjectByCode(architect.representativeImage.projectCode);
}
