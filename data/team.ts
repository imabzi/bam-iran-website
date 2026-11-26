import type { TextValue } from "@/lib/i18n";

// The people of BAM. Separate from the architects directory (data/architects.ts).
//
// Affiliation matters here. `current` is a role confirmed by BAM for the
// website. `magazine` is a person and title as published in BAMX Horizon
// magazine: the website shows that source next to them and never presents
// them as part of today's organisation chart. Change a record to `current`
// only once BAM confirms it.
//
// Persian spellings of the magazine names are transliterations of the English
// names in the magazine and are to be confirmed by BAM (see `spellingToConfirm`).
//
// No original portraits have been supplied: profiles show a neutral portrait
// placeholder. Do not crop portraits from magazine screenshots; add original
// files as `portrait` when they arrive.

export type Department = "leadership" | "technical" | "project-management" | "architecture" | "operations";

export type Affiliation = "current" | "magazine";

export type Person = {
  id: string;
  name: TextValue;
  title: TextValue; // As published or confirmed.
  department: Department;
  affiliation: Affiliation;
  portrait?: { src: string; width: number; height: number; position?: string };
  bioShort?: TextValue;
  bioLong?: TextValue;
  quote?: TextValue; // Verified quotations only.
  projectCodes?: string[]; // Verified related projects.
  images?: Array<{ src: string; caption?: TextValue }>;
  featured?: boolean; // Shown in the homepage preview.
  spellingToConfirm?: boolean;
  publication: "published" | "draft";
  source: string;
};

export const departments: Array<{ id: Department; label: TextValue }> = [
  { id: "leadership", label: { fa: "مدیریت", en: "Leadership" } },
  { id: "technical", label: { fa: "فنی و مهندسی", en: "Technical & Engineering" } },
  { id: "project-management", label: { fa: "مدیریت پروژه", en: "Project Management" } },
  { id: "architecture", label: { fa: "معماری و طراحی", en: "Architecture & Design" } },
  { id: "operations", label: { fa: "بهره‌برداری", en: "Operations" } },
];

const magazine = "BAMX Horizon magazine";

export const people: Person[] = [
  {
    id: "mehdi-kavosi",
    name: { fa: "دکتر مهدی کاووسی", en: "Dr. Mehdi Kavosi" },
    title: { fa: "مدیرعامل", en: "Chief Executive Officer" },
    department: "leadership",
    affiliation: "current",
    // From the approved company history (data/history.ts).
    bioShort: { fa: "فعالیت حرفه‌ای خود را در سال ۱۹۹۵ در حوزه ساخت‌وساز، توسعه املاک و سرمایه‌گذاری آغاز کرد؛ مسیری که به شکل‌گیری شرکت بام در سال ۲۰۰۴ در تهران انجامید." },
    featured: true,
    publication: "published",
    source: "Approved company history (BAMX Horizon magazine); CEO message brief, 1405 website update",
  },
  {
    id: "reza-ariaeinejad",
    name: { fa: "رضا آریایی‌نژاد", en: "Reza Ariaeinejad" },
    title: { fa: "مدیر فنی و مهندسی", en: "Technical & Engineering Director" },
    department: "technical",
    affiliation: "magazine",
    featured: true,
    spellingToConfirm: true,
    publication: "published",
    source: magazine,
  },
  {
    id: "farzad-fatahnaee",
    name: { fa: "فرزاد فتاح‌نائی", en: "Farzad Fatahnaee" },
    title: { fa: "مدیر پروژه", en: "Project Manager" },
    department: "project-management",
    affiliation: "magazine",
    spellingToConfirm: true,
    publication: "published",
    source: magazine,
  },
  {
    id: "anoushiravan-nourfardi",
    name: { fa: "انوشیروان نورفردی", en: "Anoushiravan Nourfardi" },
    title: { fa: "مدیر پروژه تاجیک مال", en: "Tajik Mall Project Director" },
    department: "project-management",
    affiliation: "magazine",
    projectCodes: ["I04"],
    featured: true,
    spellingToConfirm: true,
    publication: "published",
    source: magazine,
  },
  {
    id: "mona-gourabzad",
    name: { fa: "مونا گورابزاد", en: "Mona Gourabzad" },
    title: { fa: "معمار ارشد", en: "Senior Architect" },
    department: "architecture",
    affiliation: "magazine",
    featured: true,
    spellingToConfirm: true,
    publication: "published",
    source: magazine,
  },
  {
    id: "ali-tafreshi",
    name: { fa: "علی تفرشی", en: "Ali Tafreshi" },
    title: { fa: "مدیر بهره‌برداری بام نیایش مال", en: "Bam Niayesh Mall Operation Manager" },
    department: "operations",
    affiliation: "magazine",
    // BAM Niayesh Mall is the archive's Niayesh Commercial Complex (T07).
    projectCodes: ["T07"],
    spellingToConfirm: true,
    publication: "published",
    source: magazine,
  },
];

export const publishedPeople = people.filter((person) => person.publication === "published");

export const teamIntro = {
  kicker: { fa: "تیم بام" } satisfies TextValue,
  title: { fa: "تجربه، تخصص و تعهد در کنار هم" } satisfies TextValue,
  lead: { fa: "چهره‌هایی از مجموعه بام در مدیریت، مهندسی، مدیریت پروژه، معماری و بهره‌برداری؛ کسانی که پروژه‌های بام را از طراحی تا اجرا و بهره‌برداری همراهی کرده‌اند." } satisfies TextValue,
  magazineNote: { fa: "به نقل از مجله BAMX Horizon" } satisfies TextValue,
  magazineDisclaimer: { fa: "عنوان این افراد همان‌گونه درج شده که در مجله BAMX Horizon منتشر شده است و الزاماً سمت کنونی آنان در ساختار سازمانی بام نیست." } satisfies TextValue,
};

// The CEO message on the About page. Empty until BAM supplies the approved
// statement: add its paragraphs (and optionally a video) here. Nothing is
// shown as a quotation until then.
export const ceoMessage: {
  personId: string;
  paragraphs?: TextValue[];
  video?: { src: string; poster?: string };
} = {
  personId: "mehdi-kavosi",
};
