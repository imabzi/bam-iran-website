import type { TextValue } from "@/lib/i18n";

// DEVELOPMENT-ONLY SAMPLE BIOGRAPHIES — NOT VERIFIED STATEMENTS ABOUT ANYONE.
//
// Placeholder copy for reviewing the architect cards and profile layout before
// approved biographies exist. It is loaded only when demo content is enabled
// (see data/architects.ts and lib/demo.ts), so a normal production build never
// contains it, and the interface labels it "Sample text" wherever it appears.
// It deliberately states nothing specific: no degrees, awards, years,
// collaborations or achievements. Replace it with approved text by adding
// `bioShort` / `bioLong` to the architect record in data/architects.ts.

const personShort: TextValue = {
  fa: "معمار و طراح فعال در حوزه معماری و شکل‌دهی فضاهای کاربردی، با تمرکز بر کیفیت فضایی، عملکرد و توجه به جزئیات طراحی.",
  en: "An architect and designer working in architecture and the shaping of functional spaces, with a focus on spatial quality, function and attention to design detail.",
  ar: "معماري ومصمم يعمل في مجال العمارة وتشكيل الفضاءات الوظيفية، مع تركيز على جودة الفضاء والوظيفة والاهتمام بتفاصيل التصميم.",
};

const personLong: TextValue = {
  fa: "[نام معمار] در زمینه طراحی معماری و توسعه فضاهای کاربردی فعالیت می‌کند. رویکرد معرفی‌شده در این پروفایل بر شناخت بستر پروژه، توجه به نیازهای عملکردی و کیفیت فضایی تمرکز دارد.\n\nاین بخش برای معرفی مسیر حرفه‌ای، زمینه‌های تخصصی، رویکرد طراحی و همکاری‌های مرتبط با گروه بام در نظر گرفته شده است. پس از دریافت و تأیید رزومه رسمی معمار، اطلاعات تکمیلی و سوابق حرفه‌ای در این صفحه جایگزین خواهد شد.",
  en: "[Architect name] works in architectural design and the development of functional spaces. The approach outlined in this profile centres on understanding each project's context, attention to functional needs and spatial quality.\n\nThis section is reserved for the architect's professional path, areas of expertise, design approach and collaborations with BAM Group. Once the architect's official CV has been received and approved, it will replace this text.",
  ar: "يعمل [اسم المعماري] في مجال التصميم المعماري وتطوير الفضاءات الوظيفية. يركّز النهج المعروض في هذا الملف على فهم سياق المشروع، والاهتمام بالاحتياجات الوظيفية وجودة الفضاء.\n\nخُصّص هذا القسم لتقديم المسيرة المهنية ومجالات التخصص ونهج التصميم والتعاون مع مجموعة بام. وبعد استلام السيرة الذاتية الرسمية للمعماري واعتمادها، ستحلّ المعلومات المعتمدة محلّ هذا النص.",
};

const practiceShort: TextValue = {
  fa: "دفتر معماری و مشاور طراحی، با تمرکز بر کیفیت فضایی، عملکرد و هماهنگی میان طراحی و اجرا.",
  en: "An architectural practice and design consultant, with a focus on spatial quality, function and coordination between design and delivery.",
  ar: "مكتب معماري واستشاري تصميم، مع تركيز على جودة الفضاء والوظيفة والتنسيق بين التصميم والتنفيذ.",
};

export const demoArchitectBios: Record<string, { bioShort?: TextValue; bioLong?: TextValue }> = {
  "farzad-daliri": { bioShort: personShort, bioLong: personLong },
  "morteza-adib": { bioShort: personShort, bioLong: personLong },
  "maryam-yousefi": { bioShort: personShort, bioLong: personLong },
  erga: { bioShort: practiceShort },
};
