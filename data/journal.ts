import type { TextValue } from "@/lib/i18n";

// BAM Journal.
//
// The three articles below are BAM's published news, copied verbatim from the
// official website (WordPress API, bamgroup.ir) on 25 November 2026, with their
// original dates and cover images. They exist only in Persian: the English news
// page of the official site is empty. Do not reword them or add translations
// without approval. New articles are added here (or, later, through the CMS).

export type ArticleCategoryId = "residential" | "medical" | "hidden-treasure";

// The official categories. Persian labels are as published; "Hidden Treasure"
// is the official English name of the گنج پنهان programme, which as a proper
// noun keeps its Persian name in Arabic.
export const articleCategories: Record<ArticleCategoryId, TextValue> = {
  residential: { fa: "ساختمان های مسکونی", en: "Residential Buildings", ar: "المباني السكنية" },
  medical: { fa: "مراکز درمانی", en: "Medical Centres", ar: "المراكز الطبية" },
  "hidden-treasure": { fa: "گنج پنهان", en: "Hidden Treasure" },
};

export type Article = {
  id: string;
  slug: string;
  status: "draft" | "scheduled" | "published" | "archived";
  language: "fa" | "en"; // The language the article was written in.
  title: TextValue;
  body: TextValue[]; // Paragraphs.
  category: ArticleCategoryId;
  publishedAt: string; // ISO 8601, as published.
  cover?: { src: string; width: number; height: number };
  relatedProjectCodes?: string[]; // Only projects the article itself names.
  source?: string; // The original publication.
};

const allArticles: Article[] = [
  {
    id: "bam-7384",
    slug: "abdalan-35-residential-units",
    status: "published",
    language: "fa",
    title: { fa: "افتتاح 35 واحد مسکونی در منطقه زلزله زده کرمانشاه منطقه آبدالان" },
    body: [
      { fa: "در تاریخ دوازدهم مهرماه سال 1397 پس از گذشت حدود 7 ماه از آغاز عملیات ساخت 35 واحد مسکونی در روستای آبدالان این واحدها با حضور جناب آقای مهندس کرباسیان معاون محترم وزیر صنعت و معدن افتتاح گردید ." },
    ],
    category: "residential",
    publishedAt: "2023-02-15T14:02:44+03:30",
    cover: { src: "/journal/abdalan-35-units.jpg", width: 592, height: 389 },
    relatedProjectCodes: [],
    source: "https://bamgroup.ir/افتتاح-35-واحد-مسکونی-در-منطقه-زلزله-زده/",
  },
  {
    id: "bam-7359",
    slug: "district-5-mayor-visits-nikan-west-hospital",
    status: "published",
    language: "fa",
    title: { fa: "بازدید شهردار محترم منطقه پنج از پروژه بیمارستان نیکان غرب" },
    body: [
      { fa: "شهردار محترم منطقه پنج تهران جناب آقای خسروآبادی به همراه معاون شهرسازی ، معاون املاک و معاون ترافیک و برخی از مدیران شهرداری منطقه 5 تهران از پروژه بیمارستان غرب بازدید نمودند . در این دیدار که با حضور مدیرعامل گروه بیمارستان های نیکان جناب آقای دکتر تابش و همچنین مدیران شرکت پایدار بام و مدیران فنی پروژه انجام گرفت ، شهردار محترم منطقه ضمن بازدید از پروژه موضوع دسترسی به بیمارستان نیکان غرب و همچنین بیمارستان سوانح و سوختگی را مورد بررسی قرار دادند ." },
    ],
    category: "medical",
    publishedAt: "2023-02-15T12:44:14+03:30",
    cover: { src: "/journal/nikan-west-visit.jpg", width: 593, height: 394 },
    relatedProjectCodes: ["H04"],
    source: "https://bamgroup.ir/بازدید-شهردار-محترم-منطقه-پنج-از-پروژه/",
  },
  {
    id: "bam-7351",
    slug: "ceo-visit-historic-urban-fabric",
    status: "published",
    language: "fa",
    title: { fa: "بازدید مدیرعامل گروه توسعه مهندسی بام از بافت های فرسوده و تاریخی" },
    body: [
      { fa: "در راستای حمایت از بازآفرینی محله محور بافت های فرسوده ، ناپایدار و تاریخی کشور بازدیدی از روند بازآفرینی در بافت های فرسوده و تاریخی توسط مدیرعامل گروه توسعه مهندسی بام انجام شد." },
    ],
    category: "hidden-treasure",
    publishedAt: "2023-02-15T12:36:33+03:30",
    cover: { src: "/journal/historic-fabric-visit.jpg", width: 600, height: 400 },
    relatedProjectCodes: [],
    source: "https://bamgroup.ir/بازدید-مدیرعامل-گروه-توسعه-مهندسی-بام/",
  },
];

export const articles = allArticles
  .filter((article) => article.status === "published")
  .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

export function getArticle(slug: string) {
  return articles.find((article) => article.slug === slug);
}
