import type { TextValue } from "@/lib/i18n";

// Awards and recognition. The nine published records are the awards listed in
// BAMX Horizon magazine, approved for the website in the 1405 update. Each one
// also appears, in Persian and with its Solar Hijri year, in the awards
// paragraph of BAM's official About page (data/company.ts): `officialFa` and
// `solarYear` quote that page verbatim. Do not add descriptions, institutions
// or places that have not been supplied.
//
// Images: no award photography has been supplied yet, so each award shows an
// icon from components/awards/AwardIcon.tsx. Add `image` (the trophy or
// ceremony photograph) or `certificate` and the page shows it instead.

export type AwardIconId = "trophy" | "medal" | "laurel" | "certificate" | "architecture" | "recognition" | "innovation" | "crown";

// published: complete and approved, shown on the website.
// pending: mentioned by management but awaiting its year, category or issuer.
// Kept here, never shown, until the missing details are supplied.
export type AwardPublication = "published" | "pending";

export type AwardImage = { src: string; width: number; height: number; alt?: TextValue };

export type Award = {
  id: string;
  year?: number; // Gregorian, as in the magazine.
  solarYear?: string; // As given on the official Persian site.
  sourceTitle: string; // The original English title, as published in the magazine.
  title: TextValue; // The Persian display title.
  description?: TextValue;
  officialFa?: string; // The award as named on the official Persian site, verbatim.
  institution?: TextValue;
  place?: TextValue; // City and country, when verified.
  icon: AwardIconId;
  image?: AwardImage;
  certificate?: AwardImage;
  projectCode?: string; // An associated project, when verified.
  featured?: boolean; // Shown in the homepage preview.
  publication: AwardPublication;
  source: string;
};

const magazine = "BAMX Horizon magazine; bamgroup.ir/گروه-بام/ (Solar Hijri year and Persian name)";

export const awards: Award[] = [
  {
    id: "2010-developer-of-the-year",
    year: 2010,
    solarYear: "1389",
    sourceTitle: "National Developer of the Year — Premier Mass-Scale Housing",
    title: { fa: "توسعه‌دهنده برتر در پروژه‌های انبوه مسکونی", en: "National Developer of the Year — Premier Mass-Scale Housing" },
    officialFa: "تندیس بهترین انبوه ساز کشور",
    icon: "trophy",
    publication: "published",
    source: magazine,
  },
  {
    id: "2011-pioneer-modern-construction",
    year: 2011,
    solarYear: "1390",
    sourceTitle: "National Award for Pioneer in Modern Construction & Architecture",
    title: { fa: "جایزه ملی پیشگامی در ساخت‌وساز و معماری مدرن", en: "National Award for Pioneer in Modern Construction & Architecture" },
    officialFa: "جایزه بهترین مدرن ساز کشور (PRED)",
    icon: "architecture",
    publication: "published",
    source: magazine,
  },
  {
    id: "2011-hall-of-fame",
    year: 2011,
    solarYear: "1390",
    sourceTitle: "Hall of Fame Laureate — Icons of the Construction Industry",
    title: { fa: "تقدیر در جمع چهره‌های شاخص صنعت ساختمان", en: "Hall of Fame Laureate — Icons of the Construction Industry" },
    officialFa: "تندیس افتخار همایش نام آوران عرصه ساخت و ساز",
    icon: "laurel",
    publication: "published",
    source: magazine,
  },
  {
    id: "2012-bid-quality-crown",
    year: 2012,
    solarYear: "1391",
    sourceTitle: "BID International Quality Crown Award — London, UK",
    title: { fa: "جایزه بین‌المللی تاج کیفیت BID", en: "BID International Quality Crown Award" },
    officialFa: "جایزه بین المللی کیفیت BID لندن، انگلستان",
    place: { fa: "لندن، بریتانیا", en: "London, UK" },
    icon: "crown",
    featured: true,
    publication: "published",
    source: magazine,
  },
  {
    id: "2013-quality-business-excellence",
    year: 2013,
    solarYear: "1392",
    sourceTitle: "International Quality and Business Excellence Award — Rome, Italy",
    title: { fa: "جایزه بین‌المللی کیفیت و تعالی کسب‌وکار", en: "International Quality and Business Excellence Award" },
    officialFa: "جایزه بین المللی کیفیت و اعتبار کسب و کار otherway رم، ایتالیا",
    place: { fa: "رم، ایتالیا", en: "Rome, Italy" },
    icon: "medal",
    featured: true,
    publication: "published",
    source: magazine,
  },
  {
    id: "2015-national-leadership",
    year: 2015,
    solarYear: "1394",
    sourceTitle: "Distinguished National Leadership Award in Development & Infrastructure",
    title: { fa: "جایزه ملی رهبری برجسته در توسعه و زیرساخت", en: "Distinguished National Leadership Award in Development & Infrastructure" },
    officialFa: "تندیس مدیر برگزیده جهادی عرصه سازندگی در حوزه مدیریت سازندگی ساختمان های لوکس و مدرن کشور",
    icon: "recognition",
    publication: "published",
    source: magazine,
  },
  {
    id: "2015-national-champion",
    year: 2015,
    solarYear: "1394",
    sourceTitle: "National Champion — Iran’s Premier Development and Infrastructure Center",
    title: { fa: "تقدیر ملی در حوزه توسعه و زیرساخت", en: "National Champion — Iran’s Premier Development and Infrastructure Center" },
    officialFa: "برترین مرکز عرصه سازندگی کشور",
    icon: "certificate",
    publication: "published",
    source: magazine,
  },
  {
    id: "2016-architectural-excellence",
    year: 2016,
    solarYear: "1395",
    sourceTitle: "Grand Prize for Excellence in Architectural Design, Innovation, and Execution",
    title: { fa: "جایزه برتری در طراحی معماری، نوآوری و اجرا", en: "Grand Prize for Excellence in Architectural Design, Innovation, and Execution" },
    officialFa: "نشان عالی نوآوری در طراحی، معماری و اجرای پروژه های ساختمانی",
    icon: "innovation",
    featured: true,
    publication: "published",
    source: magazine,
  },
  {
    id: "2016-elite-master-contractor",
    year: 2016,
    solarYear: "1395",
    sourceTitle: "Special Distinction — Elite Master Contractor in the Construction Industry",
    title: { fa: "نشان ویژه پیمانکار برتر صنعت ساختمان", en: "Special Distinction — Elite Master Contractor in the Construction Industry" },
    officialFa: "نشان برگزیده ویژه ابر پیمانکار تخصصی در صنعت ساختمان و انبوه سازی",
    icon: "medal",
    publication: "published",
    source: magazine,
  },

  // Mentioned separately by management. Kept unpublished until the year, the
  // official category and the issuing institution are supplied.
  {
    id: "prix-versailles-bam-land",
    sourceTitle: "Prix Versailles",
    title: { fa: "جایزه ورسای", en: "Prix Versailles" },
    icon: "architecture",
    projectCode: "T09",
    publication: "pending",
    source: "BAM management, 1405 website update",
  },
  {
    // The project page already records a national award for luxury residential
    // buildings in 1390 (2011–12), from PROJECT_RESEARCH_REPORT.md. Publish once
    // management confirms the official title and issuer.
    id: "national-luxury-award-bam-jamshidieh",
    sourceTitle: "National Luxury Award",
    title: { fa: "جایزه ملی ساختمان لوکس", en: "National Luxury Award" },
    icon: "trophy",
    projectCode: "R01",
    publication: "pending",
    source: "BAM management, 1405 website update",
  },
];

export const publishedAwards = awards
  .filter((award) => award.publication === "published")
  .sort((a, b) => (a.year ?? 0) - (b.year ?? 0));

export const featuredAwards = publishedAwards.filter((award) => award.featured);

// Published awards grouped by year, oldest first.
export function awardsByYear() {
  const groups: Array<{ year: number; awards: Award[] }> = [];
  for (const award of publishedAwards) {
    if (award.year === undefined) continue;
    const group = groups.find((item) => item.year === award.year) ?? groups[groups.push({ year: award.year, awards: [] }) - 1];
    group.awards.push(award);
  }
  return groups;
}

export const awardsIntro = {
  kicker: { fa: "جوایز و افتخارات" } satisfies TextValue,
  title: { fa: "کارنامه‌ای از کیفیت، نوآوری و اعتماد" } satisfies TextValue,
  lead: { fa: "جوایز ملی و بین‌المللی که مجموعه بام در سال‌های ۲۰۱۰ تا ۲۰۱۶ در حوزه‌های انبوه‌سازی، معماری مدرن، کیفیت، توسعه و اجرای پروژه‌های ساختمانی دریافت کرده است." } satisfies TextValue,
};
