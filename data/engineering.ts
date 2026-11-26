import type { TextValue } from "@/lib/i18n";

// Engineering Excellence: BAM's engineering approach, for the homepage
// section and the About page. Wording stays general where no specific process
// or certificate has been supplied: do not add certifications, standards or
// figures without a source. The two examples in the fourth pillar were named
// by BAM management (1405 website update).

export type EngineeringPillar = {
  id: string;
  title: TextValue;
  text: TextValue;
  examples?: Array<{ projectCode: string; text: TextValue }>;
};

export const engineeringIntro = {
  kicker: { fa: "مهندسی و اجرا" } satisfies TextValue,
  title: { fa: "مهندسی دقیق، اجرای ماندگار" } satisfies TextValue,
  subtitle: { fa: "تجربه، تخصص و کنترل کیفیت در مسیر تحقق پروژه‌های پیچیده" } satisfies TextValue,
  // An existing photograph of a BAM project named in the fourth pillar.
  image: {
    projectCode: "T11",
    src: "/projects/araz-hotel/main.jpg",
    caption: { fa: "هتل آراز، ساحل دریای خزر" } satisfies TextValue,
  },
};

export const engineeringPillars: EngineeringPillar[] = [
  {
    id: "engineering-team",
    title: { fa: "تیم فنی و مهندسی" },
    text: { fa: "تیم‌های مهندسی بام و شرکت‌های زیرمجموعه آن، طراحی معماری، سازه و تأسیسات را در کنار برنامه‌ریزی و اجرا هماهنگ می‌کنند؛ از شناسایی موقعیت مناسب پروژه تا ساخت و خدمات دوره بهره‌برداری." },
  },
  {
    id: "construction-quality",
    title: { fa: "کیفیت اجرا و استانداردهای ساخت" },
    text: { fa: "کیفیت اجرا، محور کارنامه بام در ساختمان‌های مسکونی، مراکز اداری و تجاری، مجموعه‌های انبوه‌سازی و مراکز درمانی است؛ با بهره‌گیری از فناوری‌های نوین ساخت و رعایت ضوابط ساختمانی." },
  },
  {
    id: "quality-control",
    title: { fa: "کنترل کیفیت در تمام مراحل" },
    text: { fa: "بازبینی فنی طرح، نظارت بر اجرا و کنترل کیفیت در مراحل مختلف ساخت، بخشی از مسیر هر پروژه است تا آنچه طراحی شده، با همان دقت ساخته و تحویل شود." },
  },
  {
    id: "complex-delivery",
    title: { fa: "توان اجرای پروژه‌های پیچیده" },
    text: { fa: "اجرای پروژه در شرایط دشوار سایت و ساخت بناهای بلندمرتبه، بخشی از تجربه اجرایی بام است." },
    examples: [
      { projectCode: "R01", text: { fa: "بام جمشیدیه؛ ساخت بر زمینی با شیب تند و شرایط دشوار سایت" } },
      { projectCode: "T11", text: { fa: "هتل آراز؛ بنایی ۲۹ طبقه در ساحل دریای خزر" } },
    ],
  },
];
