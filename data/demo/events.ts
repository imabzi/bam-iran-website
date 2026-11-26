import type { BamEvent } from "../events";

// DEMONSTRATION CONTENT — NOT REAL BAM EVENTS.
//
// These records exist only to review the Events layouts (homepage, directory,
// detail page) before real events are supplied. They are included only while
// `demoContent.events` (lib/demo.ts) is on, which it is during the public
// design review. Every title says "Sample", every record has `demo: true`, and the interface
// marks each one with a Demo badge. They name no real person, and they use
// existing BAM photography only as clearly labelled temporary media.
// Delete this file's contents once real events exist.

export const demoEvents: BamEvent[] = [
  {
    id: "demo-1",
    slug: "sample-architecture-talk",
    demo: true,
    featured: true,
    publication: "published",
    title: {
      en: "Sample event — An evening architecture talk",
      fa: "رویداد نمونه — گفت‌وگوی معماری شبانه",
      ar: "فعالية تجريبية — أمسية حوار معماري",
    },
    summary: {
      en: "Placeholder copy for reviewing the event layout.",
      fa: "متن جایگزین برای بررسی چیدمان رویداد.",
      ar: "نص مؤقت لمراجعة تصميم صفحة الفعالية.",
    },
    description: [
      {
        en: "This is placeholder text. It shows how an event description sits on the page: a short overview, followed by the schedule, the venue and the guests.",
        fa: "این متن جایگزین است و نشان می‌دهد توضیحات یک رویداد چگونه در صفحه قرار می‌گیرد: معرفی کوتاه، سپس برنامه، مکان و مهمانان.",
        ar: "هذا نص مؤقت يوضح كيفية عرض وصف الفعالية في الصفحة: نظرة عامة قصيرة، ثم البرنامج والمكان والضيوف.",
      },
    ],
    startsAt: "2027-02-18T17:30:00+03:30",
    endsAt: "2027-02-18T20:00:00+03:30",
    location: { name: { en: "Sample venue, Tehran", fa: "مکان نمونه، تهران", ar: "مكان تجريبي، طهران" } },
    cover: { src: "/projects/bamland/exterior/exterior-06.jpg", width: 2800, height: 2103 },
    speakers: [
      { name: { en: "Sample speaker", fa: "سخنران نمونه", ar: "متحدث تجريبي" }, role: { en: "Architect", fa: "معمار", ar: "معماري" } },
      { name: { en: "Sample guest", fa: "مهمان نمونه", ar: "ضيف تجريبي" }, role: { en: "Moderator", fa: "مجری", ar: "مدير الحوار" } },
    ],
    projectCodes: ["T09"],
  },
  {
    id: "demo-2",
    slug: "sample-exhibition",
    demo: true,
    publication: "published",
    title: {
      en: "Sample event — Exhibition preview",
      fa: "رویداد نمونه — پیش‌نمایش نمایشگاه",
      ar: "فعالية تجريبية — معاينة معرض",
    },
    startsAt: "2027-04-10T10:00:00+03:30",
    endsAt: "2027-04-14T18:00:00+03:30",
    location: { name: { en: "Sample gallery", fa: "گالری نمونه", ar: "معرض تجريبي" } },
    cover: { src: "/projects/bam-farzaneh/exterior/exterior-01.jpg", width: 2800, height: 1867 },
  },
  {
    id: "demo-3",
    slug: "sample-site-visit",
    demo: true,
    publication: "published",
    title: {
      en: "Sample event — Guided site visit",
      fa: "رویداد نمونه — بازدید راهنمایی‌شده",
      ar: "فعالية تجريبية — زيارة موقع بصحبة مرشد",
    },
    summary: {
      en: "Placeholder copy for a past event with photographs.",
      fa: "متن جایگزین برای رویدادی برگزارشده همراه با تصاویر.",
      ar: "نص مؤقت لفعالية سابقة مع صور.",
    },
    description: [
      {
        en: "Placeholder text for a past event. After an event, the page leads with its photographs and videos.",
        fa: "متن جایگزین برای رویدادی برگزارشده. پس از برگزاری، صفحه رویداد با تصاویر و ویدیوها آغاز می‌شود.",
        ar: "نص مؤقت لفعالية سابقة. بعد انعقاد الفعالية تبدأ صفحتها بالصور والفيديوهات.",
      },
    ],
    startsAt: "2026-09-30T16:00:00+03:30",
    location: { name: { en: "Sample location", fa: "مکان نمونه", ar: "موقع تجريبي" } },
    cover: { src: "/projects/bam-niloufar/exterior/exterior-03.jpg", width: 2800, height: 1867 },
    gallery: [
      { src: "/projects/bam-niloufar/interior/interior-01.jpg" },
      { src: "/projects/bam-niloufar/interior/interior-02.jpg" },
      { src: "/projects/bam-niloufar/interior/interior-03.jpg" },
      { src: "/projects/bam-niloufar/interior/interior-04.jpg" },
    ],
    projectCodes: ["R08"],
  },
  {
    id: "demo-4",
    slug: "sample-workshop",
    demo: true,
    publication: "published",
    title: {
      en: "Sample event — Design workshop",
      fa: "رویداد نمونه — کارگاه طراحی",
      ar: "فعالية تجريبية — ورشة تصميم",
    },
    startsAt: "2026-06-12T10:00:00+03:30",
    location: { name: { en: "Sample studio", fa: "استودیو نمونه", ar: "استوديو تجريبي" } },
    cover: { src: "/projects/bam-rad/exterior/exterior-01.jpg", width: 2800, height: 1893 },
  },
];
