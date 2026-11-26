import type { LocalizedText, ProjectRecord } from "./projects";

// Ongoing projects and projects under negotiation, as supplied by BAM in the
// 1405 project update. Persian only for now: English and Arabic names are added
// once approved (until then these records are listed in Persian and Arabic).
//
// Record only what was supplied. Every unknown value is left out, never set to
// 0 or guessed, and is hidden on the website. No images were supplied, so cards
// and project pages show the neutral placeholder until photographs, a site
// plan or drawings are approved and added to `images`.
//
// The code is a stable id and does not encode the status: to move a project to
// another stage, change `status` only. Its URL stays the same.
//
// BAM Land Shiraz (بام لند شیراز), the first ongoing project in the update, is
// the existing archive record M05: see projectContent.ts.

const iran: LocalizedText = { en: "Iran", fa: "ایران" };
const bamShahr = { fa: "شرکت بام شهر" };

export const currentProjects: ProjectRecord[] = [
  // ---------- Ongoing ----------
  {
    code: "P01",
    slug: "pakshoma-head-office",
    title: { fa: "دفتر مرکزی پاکشوما" },
    status: "ongoing",
    publication: "published",
    images: { exterior: [], interior: [] },
    facts: {
      client: { fa: "شرکت پاکشوما" },
      constructionManager: bamShahr,
    },
  },
  {
    code: "P02",
    slug: "hotel-makitakish",
    title: { fa: "هتل ماکیتاکیش" },
    status: "ongoing",
    publication: "published",
    images: { exterior: [], interior: [] },
    facts: {
      builtUpArea: 250000,
      areaDisplay: { builtUpArea: { approximate: true } },
      client: { fa: "هواپیمایی ایران ایرتور" },
      constructionManager: bamShahr,
    },
  },
  {
    code: "P03",
    slug: "bam-land-mazandaran",
    title: { fa: "بام لند مازندران" },
    status: "ongoing",
    publication: "published",
    images: { exterior: [], interior: [] },
    facts: {
      builtUpArea: 140000,
      client: { fa: "دکتر مهدی کاوسی و مهندس فرزاد دلیری" },
      participants: [bamShahr],
    },
  },

  // ---------- Under negotiation ----------
  // Master developments under negotiation: not contracted, approved or under
  // construction. No dates, roles or renderings are recorded.
  {
    code: "P04",
    slug: "bam-land-gilan",
    title: { fa: "بام لند گیلان" },
    status: "under-negotiation",
    categoryId: "large-scale",
    classificationId: "master-development",
    publication: "published",
    images: { exterior: [], interior: [] },
    location: { province: { fa: "گیلان" }, country: iran },
    facts: { siteArea: 50 * 10_000, areaDisplay: { siteArea: { unit: "ha" } } },
  },
  {
    code: "P05",
    slug: "bam-land-khorasan-razavi",
    title: { fa: "بام لند خراسان رضوی" },
    status: "under-negotiation",
    categoryId: "large-scale",
    classificationId: "master-development",
    publication: "published",
    images: { exterior: [], interior: [] },
    location: { province: { fa: "خراسان رضوی" }, country: iran },
    facts: { siteArea: 1500 * 10_000, areaDisplay: { siteArea: { unit: "ha" } } },
  },
  {
    code: "P06",
    slug: "bam-land-kish",
    title: { fa: "بام لند کیش" },
    status: "under-negotiation",
    categoryId: "large-scale",
    classificationId: "master-development",
    publication: "published",
    images: { exterior: [], interior: [] },
    location: { city: { fa: "کیش" }, country: iran },
    facts: { siteArea: 350 * 10_000, areaDisplay: { siteArea: { unit: "ha" } } },
  },
];
