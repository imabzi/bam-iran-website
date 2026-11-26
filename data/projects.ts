import { resolveText, type ContentLanguage, type Language, type TextValue } from "@/lib/i18n";
import { currentProjects } from "./currentProjects";
import { projectContent } from "./projectContent";
import { approvedLocations } from "./projectLocations";
import { importedProjectImages } from "./projectImages.generated";

// A value that exists in both content languages. `ar` is added only once an
// approved Arabic translation exists; until then Arabic shows the verified
// original (see resolveText in lib/i18n.ts).
export type LocalizedText = Record<ContentLanguage, string> & { ar?: string };
// A value that may exist in only one language so far. English and Persian never
// fall back to each other: text missing in one of them is hidden there.
export type PartialLocalizedText = TextValue;

export type CategoryId = "residential" | "commercial-leisure" | "hospitality" | "sports" | "large-scale" | "healthcare" | "international";

export type ProjectCategory = LocalizedText & { id: CategoryId };

// Project lifecycle, kept separate from the category. A project moves from
// negotiation to ongoing to completed by changing `status` alone: its code,
// slug, URL and content stay the same.
export type ProjectStatus = "ongoing" | "under-negotiation" | "completed";

// In display order: the homepage tabs and archive filter follow it.
export const projectStatuses: Record<ProjectStatus, LocalizedText & { id: ProjectStatus }> = {
  ongoing: { id: "ongoing", en: "Ongoing", fa: "در حال اجرا", ar: "قيد التنفيذ" },
  "under-negotiation": { id: "under-negotiation", en: "Under negotiation", fa: "در حال مذاکره", ar: "قيد التفاوض" },
  completed: { id: "completed", en: "Completed", fa: "تکمیل‌شده", ar: "مكتمل" },
};
export const projectStatusIds = Object.keys(projectStatuses) as ProjectStatus[];

export function isProjectStatus(value: string | null | undefined): value is ProjectStatus {
  return Boolean(value && value in projectStatuses);
}

// A development classification, shown on cards in place of a category label
// when one is recorded.
export type DevelopmentClassId = "master-development";
export const developmentClasses: Record<DevelopmentClassId, LocalizedText & { id: DevelopmentClassId }> = {
  "master-development": { id: "master-development", en: "Master Development", fa: "مستر دولوپمنت", ar: "التطوير الشامل" },
};

// Publication is decided here and nowhere else. `published` records appear in
// the homepage, the archive, the sitemap and at /projects/<slug>; `draft`
// records are kept in the data but are not built or listed. Missing images or
// facts never affect publication.
export type ProjectPublication = "published" | "draft";

export type ProjectDrawing = {
  src: string;
  block?: PartialLocalizedText; // The building or block the drawing belongs to.
  caption?: PartialLocalizedText;
};

// Every list may be empty and every single image may be missing: cards and the
// project page then show the neutral placeholder (components/ProjectMedia.tsx).
export type ProjectImages = {
  hero?: string; // A chosen hero image. Otherwise the first exterior image.
  cover?: string;
  card?: string; // A smaller copy of the cover for the Visual View.
  exterior: string[]; // Feeds the hero slider. Exterior photography only.
  interior: string[]; // Feeds the two-column gallery.
  other?: string[]; // Imported but unclassified. Not displayed.
  amenities?: string[];
  details?: string[];
  plans?: string[]; // Imported plan sheets. Not displayed until approved.
  archive?: string[];
  // Approved for publication. Each shows as its own section when not empty.
  sitePlans?: string[];
  drawings?: ProjectDrawing[]; // Grouped by `block` on the project page.
  floorPlans?: string[];
  progress?: string[]; // Construction progress photography.
  gallery?: string[]; // Renders and other approved photographs.
  videos?: string[]; // Approved construction or project videos (MP4).
};

// An approved downloadable brochure. The button appears only when this is set,
// so add it together with the file in public/.
export type ProjectBrochure = { src: string; sizeLabel?: PartialLocalizedText };

export type ProjectLocation = {
  country?: PartialLocalizedText;
  province?: PartialLocalizedText;
  city?: PartialLocalizedText;
  district?: PartialLocalizedText;
  addressFa?: string; // The approved full address. Persian only: never machine-translated.
  googleMapsUrl?: string; // The approved link, used exactly as supplied.
  coordinates?: { lat: number; lng: number }; // Verified only; never inferred from a name.
};

export type AreaFact = "siteArea" | "builtUpArea" | "grossFloorArea";

// Only add verified values. Anything left out is hidden on the project page.
// Never store 0 or a guess for an unknown value: leave the field out.
export type ProjectFacts = {
  completionYear?: PartialLocalizedText; // e.g. { en: "2023", fa: "۱۴۰۱" }
  startDate?: PartialLocalizedText;
  estimatedCompletion?: PartialLocalizedText;
  siteArea?: number; // m²
  builtUpArea?: number; // m²
  grossFloorArea?: number; // m²
  // How an area was supplied: in hectares, or as an approximate value. The
  // stored value is always m²; this only changes how it is shown.
  areaDisplay?: Partial<Record<AreaFact, { unit?: "ha"; approximate?: boolean }>>;
  floors?: number;
  units?: number;
  buildings?: number; // Buildings or blocks.
  parking?: number;
  use?: PartialLocalizedText; // Usage or function.
  structure?: PartialLocalizedText;
  facade?: PartialLocalizedText;
  architect?: PartialLocalizedText;
  // Stakeholders. Each role is its own field: never assume that the client,
  // owner, developer, builder and construction manager are the same party.
  client?: PartialLocalizedText;
  owner?: PartialLocalizedText;
  developer?: PartialLocalizedText;
  builder?: PartialLocalizedText;
  contractor?: PartialLocalizedText;
  constructionManager?: PartialLocalizedText;
  projectManagement?: PartialLocalizedText;
  participants?: PartialLocalizedText[]; // Participating companies.
  partners?: PartialLocalizedText[]; // Other verified partners.
  status?: PartialLocalizedText; // Legacy free-text status. Superseded by Project.status.
  // Technical details and construction challenges. Verified statements only:
  // never inferred from photographs. Shown in their own section when present.
  constructionMethod?: PartialLocalizedText;
  siteConditions?: PartialLocalizedText;
  engineeringChallenges?: PartialLocalizedText;
  technicalSolutions?: PartialLocalizedText;
  qualityControl?: PartialLocalizedText;
  engineeringAchievements?: PartialLocalizedText;
};

// A project's name. Persian always exists; English and Arabic are added once
// approved. Use projectTitle() for a string in the active language.
export type ProjectTitle = PartialLocalizedText & { fa: string };

export type Project = {
  code: string; // Stable id. Never encodes the status.
  slug: string; // Stable URL segment.
  title: ProjectTitle;
  status: ProjectStatus;
  category?: ProjectCategory; // Left out until verified: the project still lists under "All".
  classification?: LocalizedText & { id: DevelopmentClassId };
  publication: ProjectPublication;
  summary?: PartialLocalizedText; // Short description.
  description?: PartialLocalizedText; // Full description.
  images: ProjectImages;
  location?: ProjectLocation;
  facts: ProjectFacts;
  brochure?: ProjectBrochure;
};

// A record in data/currentProjects.ts, which names its category and
// classification by id (that file imports only types from this one).
export type ProjectRecord = Omit<Project, "category" | "classification"> & {
  categoryId?: CategoryId;
  classificationId?: DevelopmentClassId;
};

export type ProjectContent = Partial<Pick<Project, "status" | "summary" | "description" | "images" | "location" | "facts" | "brochure">>;

// The approved category order and labels. The internal ids are unchanged.
export const projectCategories: Record<CategoryId, ProjectCategory> = {
  residential: { id: "residential", en: "Residential", fa: "مسکونی", ar: "سكني" },
  "commercial-leisure": { id: "commercial-leisure", en: "Commercial", fa: "تجاری", ar: "تجاري" },
  hospitality: { id: "hospitality", en: "Hospitality", fa: "هتل و اقامتگاه", ar: "الفنادق والضيافة" },
  sports: { id: "sports", en: "Sports", fa: "ورزشی", ar: "رياضي" },
  healthcare: { id: "healthcare", en: "Medical", fa: "پزشکی", ar: "طبي" },
  international: { id: "international", en: "International", fa: "بین‌المللی", ar: "دولي" },
  "large-scale": { id: "large-scale", en: "Developments", fa: "پروژه‌های کلان", ar: "المشاريع الكبرى" },
};

// A project with no photography has empty image lists. Cards and the project
// page then show the neutral placeholder from components/ProjectMedia.tsx, so
// a missing image never hides a project or leaves an empty frame.
const noImages = (): ProjectImages => ({ exterior: [], interior: [] });

const raw: ReadonlyArray<readonly [string, string, string, CategoryId]> = [
  ["R01","بام جمشیدیه","BAM Jamshidieh","residential"],
  ["R02","بام البرز","BAM Alborz","residential"],
  ["R03","بام مهماندوست","BAM Mehmandoost","residential"],
  ["R04","بام نسرین","BAM Nasrin","residential"],
  ["R05","بام نیاوران ۱","BAM Niavaran 01","residential"],
  ["R06","بام نیاوران ۲","BAM Niavaran 02","residential"],
  ["R07","بام نیاوران ۳","BAM Niavaran 03","residential"],
  ["R08","بام نیلوفر","BAM Niloufar","residential"],
  ["R09","بام چوبینه","BAM Choobineh","residential"],
  ["R10","بام فرشته","BAM Fereshteh","residential"],
  ["R11","بام زعفرانیه (سروستان)","BAM Zafaraniyeh (Sarvestan)","residential"],
  ["R12","بام راد","BAM Rad","residential"],
  ["R13","بام سیمین‌دخت","BAM Simindokht","residential"],
  ["R14","بام فرزانه","BAM Farzaneh","residential"],
  ["R15","بام سپید","BAM Sepid","residential"],
  ["R16","بام دربند ۱","BAM Darband 01","residential"],
  ["R17","بام دربند ۲","BAM Darband 02","residential"],
  ["R18","بام نارنجستان","BAM Narenjestan","residential"],
  ["R19","بام نیایش","BAM Niayesh","residential"],
  ["R20","بام سامان","BAM Saman","residential"],
  ["R21","بام مهتاب","BAM Mahtab","residential"],
  ["R22","بام مریم","BAM Maryam","residential"],
  ["R23","بام دربندسر","BAM Darbandsar","residential"],
  ["R24","بام آدرس چالوس","BAM Address Chalous","residential"],
  ["T01","بام سنتر - دفتر مرکزی","BAM Center — Head Office","commercial-leisure"],
  ["T02","بام سنتر فرمانیه","BAM Center Farmanieh","commercial-leisure"],
  ["T03","آوان سنتر","Avaan Center","commercial-leisure"],
  ["T04","بام سنتر شریعتی","BAM Center Shariati","commercial-leisure"],
  ["T05","بام سنتر یگانه","BAM Center Yeganeh","commercial-leisure"],
  ["T06","بام سنتر کامرانیه","BAM Center Kamranieh","commercial-leisure"],
  ["T07","مجتمع تجاری نیایش","Niayesh Commercial Complex","commercial-leisure"],
  ["T08","باشگاه سوارکاری بام","BAM Equestrian Club","sports"],
  ["T09","بام‌لند","Bamland","commercial-leisure"],
  ["T10","دریاچه مصنوعی خلیج فارس","Persian Gulf Artificial Lake","commercial-leisure"],
  ["T11","هتل آراز","Araz Hotel","hospitality"],
  ["T12","بام سنتر بخارست","BAM Center Bokharest","commercial-leisure"],
  ["T13","بام سنتر وصالی","BAM Center Vesali","commercial-leisure"],
  ["T14","بام آدرس شیراز","BAM Address Shiraz","commercial-leisure"],
  ["M01","پروژه ۱۰۰۲ واحدی بوستان هشتگرد","Boostan Hashtgerd 1002-Unit Project","large-scale"],
  ["M02","پروژه ایران‌خودرو","Iran Khodro Project","large-scale"],
  ["M03","بوستان عسلویه","Boostan Asaluyeh","large-scale"],
  ["M04","گلستان مشکین‌شهر","Golestan Meshgin Shahr","large-scale"],
  // M05 is the project supplied in 1405 as «بام لند شیراز» (previously listed as
  // «شهرک بام لند شیراز»): same project, so its code, slug and renders are kept.
  ["M05","بام لند شیراز","BAM Land Shiraz Township","large-scale"],
  ["H01","بیمارستان نیکان","Nikan Hospital","healthcare"],
  ["H02","کلینیک عرفان","Erfan Clinic","healthcare"],
  ["H03","مرکز ملی سرطان","National Cancer Center","healthcare"],
  ["H04","بیمارستان نیکان غرب","Nikan West Hospital","healthcare"],
  ["H05","بیمارستان سپید","Sepid Hospital","healthcare"],
  ["H06","درمانگاه تخصصی شهرداری منطقه ۱۴","District 14 Specialized Clinic","healthcare"],
  ["H07","کلینیک طهرانی","Tehrani Clinic","healthcare"],
  ["H08","کلینیک نیکان","Nikan Clinic","healthcare"],
  ["H09","بیمارستان نیکان نگین","Nikan Negin Hospital","healthcare"],
  ["H10","طرح توسعه نیکان","Nikan Hospital Expansion","healthcare"],
  ["I01","311","311","international"],
  ["I02","B77","B77","international"],
  ["I03","X11","X11","international"],
  ["I04","تاجیک مال","Tajik Mall","international"],
  ["I05","ساختمان مسکونی رویال","Royal Residential Building","international"],
];

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/—/g, "-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// The archive's existing portfolio is completed work unless its content
// records another status (see projectContent.ts).
const archiveProjects: Project[] = raw.map(([code, titleFa, titleEn, categoryId]) => {
  const content = projectContent[code];
  return {
    code,
    slug: slugify(titleEn),
    title: { en: titleEn, fa: titleFa },
    status: content?.status ?? "completed",
    category: projectCategories[categoryId],
    publication: "published",
    summary: content?.summary,
    description: content?.description,
    images: content?.images ?? importedProjectImages[code] ?? noImages(),
    location: { ...content?.location, ...approvedLocations[code] },
    facts: content?.facts ?? {},
    brochure: content?.brochure,
  };
});

const statusOrder = (project: Project) => projectStatusIds.indexOf(project.status);

// Every record, in display order: ongoing, then under negotiation, then
// completed, each keeping its order in the data.
const addedProjects: Project[] = currentProjects.map(({ categoryId, classificationId, ...record }) => ({
  ...record,
  category: categoryId ? projectCategories[categoryId] : undefined,
  classification: classificationId ? developmentClasses[classificationId] : undefined,
}));

const allProjects: Project[] = [...archiveProjects, ...addedProjects]
  .map((project, index) => ({ project, index }))
  .sort((a, b) => statusOrder(a.project) - statusOrder(b.project) || a.index - b.index)
  .map(({ project }) => project);

// Codes and slugs must stay unique: a duplicate fails the build.
for (const key of ["code", "slug"] as const) {
  const seen = new Set<string>();
  for (const project of allProjects) {
    if (seen.has(project[key])) throw new Error(`Duplicate project ${key}: ${project[key]}`);
    seen.add(project[key]);
  }
}

export function isPublished(project: Project) {
  return project.publication === "published";
}

// The one project list used by the homepage, the archive, project pages,
// architects, events and the sitemap.
export const projects: Project[] = allProjects.filter(isPublished);

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export function getCoverImage(project: Project): string | undefined {
  return project.images.card ?? project.images.cover ?? project.images.hero ?? project.images.exterior[0];
}

export function getProjectByCode(code: string) {
  return projects.find((project) => project.code === code);
}

// True when the project has real photography. Used for ordering only: a
// project without photography is never hidden.
export function hasPhotography(project: Project) {
  return project.images.exterior.length > 0 || Boolean(project.images.hero);
}

// The project's name in the active language. Persian and Arabic always have
// one; English shows the Persian name, marked as such, until an English name is
// approved.
export function projectTitleText(project: Project, language: Language) {
  return resolveText(project.title, language) ?? { text: project.title.fa, lang: "fa" as Language };
}

export function projectTitle(project: Project, language: Language) {
  return projectTitleText(project, language).text;
}

// Whether the project is listed in this language. A record whose name exists
// only in Persian is listed in Persian and Arabic (which shows the Persian
// original) but not yet in English, which never mixes in Persian text.
export function isListedIn(project: Project, language: Language) {
  return resolveText(project.title, language) !== undefined;
}
