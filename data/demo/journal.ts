import type { TextValue } from "@/lib/i18n";

// DEMONSTRATION CONTENT — NOT BAM JOURNAL ARTICLES.
//
// Five sample editorial articles for reviewing the homepage Journal slider
// before more real articles exist. They are kept apart from the verified
// Journal (data/journal.ts), never appear in the Journal archive or sitemap,
// have no detail pages, and are shown only while `demoContent.journal`
// (lib/demo.ts) is on. The interface marks each one with a Demo badge.
//
// The copy is general architectural commentary: it states no BAM announcement,
// project fact or achievement. The dates are sample dates. The photographs are
// existing BAM project images, used only as clearly labelled temporary media;
// none of the articles describes the pictured project.

export type DemoJournalArticle = {
  id: string;
  demo: true;
  title: TextValue;
  summary: TextValue;
  category: TextValue;
  publishedAt: string; // Sample date.
  cover: { src: string; width: number; height: number; position?: string };
};

export const demoJournalArticles: DemoJournalArticle[] = [
  {
    id: "demo-journal-1",
    demo: true,
    title: {
      fa: "معماری معاصر و آینده شهرها",
      en: "Contemporary Architecture and the Future of Cities",
      ar: "العمارة المعاصرة ومستقبل المدن",
    },
    summary: {
      fa: "معماری معاصر چگونه می‌تواند شهرهای متراکم را انسانی‌تر کند: کاربری‌های ترکیبی، طبقات همکف عمومی و ساختمان‌هایی که به اقلیم، نور و زندگی خیابان پاسخ می‌دهند.",
      en: "How contemporary architecture can make denser cities more humane: mixed uses, generous public ground floors and buildings that respond to climate, light and the life of the street.",
      ar: "كيف يمكن للعمارة المعاصرة أن تجعل المدن الكثيفة أكثر إنسانية: استخدامات مختلطة، وطوابق أرضية مفتوحة للعامة، ومبانٍ تستجيب للمناخ والضوء وحياة الشارع.",
    },
    category: { fa: "شهرسازی", en: "Urbanism", ar: "العمران" },
    publishedAt: "2026-11-18T10:00:00+03:30",
    cover: { src: "/projects/bam-address-shiraz/exterior/exterior-01.jpg", width: 2596, height: 1835, position: "50% 55%" },
  },
  {
    id: "demo-journal-2",
    demo: true,
    title: {
      fa: "تحولات طراحی ساختمان‌های مسکونی",
      en: "The Evolution of Residential Architecture",
      ar: "تطور تصميم المباني السكنية",
    },
    summary: {
      fa: "از بلوک‌های آپارتمانی بسته تا خانه‌هایی که بر پایه نور، حریم خصوصی و فضای مشترک شکل می‌گیرند: نگاهی به تحول طراحی مسکونی و انتظارات خانواده‌های امروز.",
      en: "From closed apartment blocks to homes built around light, privacy and shared space: a look at how residential design has changed, and what today's families expect from it.",
      ar: "من الكتل السكنية المغلقة إلى منازل تتمحور حول الضوء والخصوصية والمساحات المشتركة: نظرة على تطور التصميم السكني وما تتوقعه الأسر اليوم.",
    },
    category: { fa: "مسکونی", en: "Residential", ar: "السكن" },
    publishedAt: "2026-10-28T10:00:00+03:30",
    cover: { src: "/projects/bam-mehmandoost/exterior/exterior-01.jpg", width: 2800, height: 1822 },
  },
  {
    id: "demo-journal-3",
    demo: true,
    title: {
      fa: "کیفیت فضایی در معماری امروز",
      en: "Spatial Quality in Contemporary Architecture",
      ar: "الجودة المكانية في العمارة المعاصرة",
    },
    summary: {
      fa: "تناسبات، نور روز، مصالح و توالی فضاها از خیابان تا درون: کیفیت‌های آرامی که تعیین می‌کنند یک ساختمان تا چه اندازه گشاده، آرام و دلپذیر برای زندگی است.",
      en: "Proportion, daylight, materials and the sequence of spaces from street to interior: the quiet qualities that decide whether a building feels generous, calm and easy to live in.",
      ar: "التناسب وضوء النهار والمواد وتسلسل الفراغات من الشارع إلى الداخل: صفات هادئة تحدد ما إذا كان المبنى رحبًا وهادئًا ومريحًا للعيش.",
    },
    category: { fa: "طراحی", en: "Design", ar: "التصميم" },
    publishedAt: "2026-10-07T10:00:00+03:30",
    cover: { src: "/projects/bam-niavaran-03/exterior/exterior-01.jpg", width: 2800, height: 1867 },
  },
  {
    id: "demo-journal-4",
    demo: true,
    title: {
      fa: "فناوری‌های نوین در صنعت ساختمان",
      en: "Innovative Technologies in Construction",
      ar: "التقنيات الحديثة في قطاع البناء",
    },
    summary: {
      fa: "مدل‌سازی دیجیتال، نماهای با عملکرد بالا و سیستم‌های پیش‌ساخته شیوه طراحی و اجرای ساختمان‌ها را تغییر می‌دهند؛ با دقت بیشتر، زمان‌بندی کوتاه‌تر و ضایعات کمتر در کارگاه.",
      en: "Digital modelling, high-performance facades and prefabricated systems are changing how buildings are designed and delivered, with greater precision, faster schedules and less waste on site.",
      ar: "تغيّر النمذجة الرقمية والواجهات عالية الأداء والأنظمة مسبقة الصنع طريقة تصميم المباني وتنفيذها، بدقة أكبر وجداول زمنية أقصر وهدر أقل في الموقع.",
    },
    category: { fa: "فناوری", en: "Technology", ar: "التقنية" },
    publishedAt: "2026-09-16T10:00:00+03:30",
    cover: { src: "/projects/bam-center-kamranieh/exterior/exterior-01.jpg", width: 2800, height: 1867, position: "50% 40%" },
  },
  {
    id: "demo-journal-5",
    demo: true,
    title: {
      fa: "معماری پایدار و محیط زیست",
      en: "Sustainable Architecture and the Environment",
      ar: "العمارة المستدامة والبيئة",
    },
    summary: {
      fa: "جهت‌گیری، سایه‌اندازی، تراس‌های سبز و مصالح بادوام: معماری پایدار چگونه مصرف انرژی را کاهش می‌دهد و طبیعت را از یک خانه تا یک محله به شهر بازمی‌گرداند.",
      en: "Orientation, shading, planted terraces and durable materials: how sustainable architecture reduces energy use and brings landscape back into the city, from a single home to a district.",
      ar: "التوجيه والتظليل والشرفات المزروعة والمواد المتينة: كيف تخفّض العمارة المستدامة استهلاك الطاقة وتعيد الطبيعة إلى المدينة، من منزل واحد إلى حي كامل.",
    },
    category: { fa: "پایداری", en: "Sustainability", ar: "الاستدامة" },
    publishedAt: "2026-08-26T10:00:00+03:30",
    cover: { src: "/projects/b77/exterior/exterior-01.jpg", width: 2800, height: 1865 },
  },
];
