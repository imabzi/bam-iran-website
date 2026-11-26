import type { TextValue } from "@/lib/i18n";

// BAM's corporate history: the seven milestones of the history published in
// BAMX Horizon magazine, approved for the website in the 1405 update. This is
// the only copy. The homepage timeline and the About page both read it.
//
// Years are Gregorian, as in the magazine. Keep the meaning of each milestone
// as approved: 1995 is Dr Kavosi's professional beginning and 2004 is the
// founding of BAM, two separate events. 2028 and 2032 are plans and a vision,
// never achievements, and are labelled as such wherever they appear.
//
// Persian only for this phase. English and Arabic text is added later; until
// then English hides the timeline and Arabic shows the Persian original.

export type MilestoneKind = "history" | "plan" | "vision";

// What the visual panel shows for a milestone. A photograph is used only where
// it is an existing BAM project that belongs to that period (its completion or
// opening year) or that the milestone names. Otherwise abstract linework is
// drawn, never a building presented as a real historical project.
export type MilestoneVisual =
  | { type: "drawing"; drawing: "origin" | "foundation" | "network" | "horizon" }
  | {
      type: "photo";
      projectCode: string;
      src: string;
      position?: string;
      caption: TextValue;
      render?: boolean; // An architectural rendering, not a photograph.
    };

export type Milestone = {
  id: string;
  years: [number] | [number, number];
  kind: MilestoneKind;
  label: TextValue; // The short name of the stage.
  heading: TextValue;
  text: TextValue;
  visual: MilestoneVisual;
};

export const historyIntro = {
  kicker: { fa: "تاریخچه بام" } satisfies TextValue,
  title: { fa: "از یک ایده تا یک میراث ماندگار" } satisfies TextValue,
  subtitle: { fa: "روایتی از شکل‌گیری، رشد و توسعه بام در مسیر معماری و ساخت‌وساز" } satisfies TextValue,
  yearsNote: { fa: "سال‌ها به میلادی" } satisfies TextValue,
};

// Labels for the schematic network diagram of the 2024 milestone.
export const networkLabels: Record<"iran" | "uae" | "armenia" | "tajikistan", TextValue> = {
  iran: { fa: "ایران" },
  uae: { fa: "امارات" },
  armenia: { fa: "ارمنستان" },
  tajikistan: { fa: "تاجیکستان" },
};

export const milestoneKindLabels: Record<Exclude<MilestoneKind, "history">, TextValue> = {
  plan: { fa: "برنامه آینده" },
  vision: { fa: "چشم‌انداز آینده" },
};

export const milestones: Milestone[] = [
  {
    id: "1995",
    years: [1995],
    kind: "history",
    label: { fa: "آغاز مسیر حرفه‌ای" },
    heading: { fa: "آغاز تجربه در ساخت‌وساز و توسعه" },
    text: { fa: "دکتر مهدی کاووسی فعالیت حرفه‌ای خود را در حوزه ساخت‌وساز، توسعه املاک و سرمایه‌گذاری آغاز کرد؛ مسیری که در سال‌های بعد به شکل‌گیری و توسعه مجموعه بام انجامید." },
    visual: { type: "drawing", drawing: "origin" },
  },
  {
    id: "2004",
    years: [2004],
    kind: "history",
    label: { fa: "تأسیس بام" },
    heading: { fa: "شکل‌گیری شرکت بام در تهران" },
    text: { fa: "شرکت بام در تهران تأسیس شد و با تکیه بر تجربه حرفه‌ای دکتر کاووسی، فعالیت خود را به‌عنوان مجموعه‌ای متمرکز بر ساخت‌وساز و توسعه پروژه‌های ساختمانی گسترش داد." },
    visual: { type: "drawing", drawing: "foundation" },
  },
  {
    id: "2007-2011",
    years: [2007, 2011],
    kind: "history",
    label: { fa: "گسترش سبد پروژه‌ها" },
    heading: { fa: "توسعه فعالیت در بخش‌های مختلف" },
    text: { fa: "بام با اجرای پروژه‌های مسکونی، صنعتی و درمانی، دامنه فعالیت‌های خود را گسترش داد و حضور خود را در تهران و سایر مناطق ایران تقویت کرد." },
    // Completed in 1390 (2011–12), when it received the national luxury award.
    visual: {
      type: "photo",
      projectCode: "R01",
      src: "/projects/bam-jamshidieh/exterior/exterior-01.jpg",
      position: "50% 45%",
      caption: { fa: "بام جمشیدیه، تکمیل ۱۳۹۰" },
    },
  },
  {
    id: "2012-2017",
    years: [2012, 2017],
    kind: "history",
    label: { fa: "توسعه تخصصی" },
    heading: { fa: "گسترش فعالیت در حوزه‌های متنوع ساخت‌وساز" },
    text: { fa: "دامنه پروژه‌های بام به حوزه‌های متنوع‌تری از جمله بیمارستان‌ها، مراکز درمانی، مراکز تجاری، هتل‌ها و پروژه‌های مسکونی شاخص توسعه یافت." },
    // Opened in Esfand 1391 (March 2013).
    visual: {
      type: "photo",
      projectCode: "H06",
      src: "/projects/district-14-specialized-clinic/exterior/exterior-01.jpg",
      caption: { fa: "درمانگاه تخصصی شهرداری منطقه ۱۴، افتتاح ۱۳۹۱" },
    },
  },
  {
    id: "2024",
    years: [2024],
    kind: "history",
    label: { fa: "توسعه بین‌المللی" },
    heading: { fa: "گسترش فعالیت‌ها در بازارهای بین‌المللی" },
    text: { fa: "مجموعه با توسعه فعالیت‌های بین‌المللی خود تحت برند BAMX، حضور در بازارهایی از جمله امارات متحده عربی، ارمنستان و تاجیکستان را گسترش داد." },
    visual: { type: "drawing", drawing: "network" },
  },
  {
    id: "2028",
    years: [2028],
    kind: "plan",
    label: { fa: "برنامه‌های تحویل آینده" },
    heading: { fa: "تحویل پروژه‌های برنامه‌ریزی‌شده" },
    text: { fa: "بر اساس برنامه‌های توسعه مطرح‌شده در تاریخچه مجموعه، تحویل تعدادی از پروژه‌های منتخب در امارات و ایران، از جمله بام لند شیراز، برای این دوره پیش‌بینی شده است." },
    // Named in the milestone. An architectural rendering of a project in progress.
    visual: {
      type: "photo",
      projectCode: "M05",
      src: "/projects/bam-land-shiraz-township/exterior/exterior-01.jpg",
      caption: { fa: "بام لند شیراز، رندر معماری" },
      render: true,
    },
  },
  {
    id: "2032",
    years: [2032],
    kind: "vision",
    label: { fa: "چشم‌انداز توسعه" },
    heading: { fa: "افق‌های جدید در توسعه منطقه‌ای" },
    text: { fa: "چشم‌انداز مجموعه بر ورود به بازارهای جدید، توسعه همکاری‌های راهبردی و شناسایی فرصت‌های تازه در حوزه ساخت‌وساز و توسعه املاک در منطقه متمرکز است." },
    visual: { type: "drawing", drawing: "horizon" },
  },
];

// The founding year, used by the "years since founding" statistic.
export const foundingYear = 2004;
