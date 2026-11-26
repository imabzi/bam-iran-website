export const languages = ["en", "fa", "ar"] as const;
export type Language = (typeof languages)[number];

// Verified project, company and journal content exists in English and Persian.
// Arabic is an interface language: content gains an optional `ar` value once an
// approved translation exists. See `resolveText` for the documented fallback.
export type ContentLanguage = "en" | "fa";

export const defaultLanguage: Language = "en";

// Each language's own name, used by the language switcher. Never translated.
export const languageNames: Record<Language, string> = { en: "English", fa: "فارسی", ar: "العربية" };
export const languageCodes: Record<Language, string> = { en: "EN", fa: "FA", ar: "AR" };

export function directionOf(language: Language) {
  return language === "en" ? "ltr" : "rtl";
}

const numberLocales: Record<Language, string> = { en: "en-US", fa: "fa-IR", ar: "ar" };

export function formatNumber(value: number, language: Language, options?: Intl.NumberFormatOptions) {
  return new Intl.NumberFormat(numberLocales[language], options).format(value);
}

// Persian dates use the Solar Hijri calendar, English and Arabic the Gregorian one.
const dateLocales: Record<Language, string> = { en: "en-GB", fa: "fa-IR-u-ca-persian", ar: "ar-u-ca-gregory" };

export function formatDate(iso: string, language: Language, options: Intl.DateTimeFormatOptions = {}) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return undefined;
  return new Intl.DateTimeFormat(dateLocales[language], {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Tehran",
    ...options,
  }).format(date);
}

export function formatTime(iso: string, language: Language) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return undefined;
  return new Intl.DateTimeFormat(dateLocales[language], { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Tehran" }).format(date);
}

export type TextValue = Partial<Record<Language, string>>;
export type ResolvedText = { text: string; lang: Language };

// Placeholder values that must never reach the page, even if entered in the data.
const EMPTY_VALUE = /^(n\/?a|unknown|none|null|tbd|-+|–|—|0|۰|٠|نامشخص)$/i;

/**
 * Picks the text for the active language.
 *
 * English and Persian never fall back: text that exists only in the other
 * language is hidden. Arabic shows an approved `ar` value when one exists and
 * otherwise falls back to the verified original — Persian by default (same
 * script, proper nouns kept as approved), or English for Gregorian values such
 * as completion years. The returned `lang` lets the caller mark fallback text
 * with the correct `lang` attribute.
 */
export function resolveText(
  value: TextValue | undefined,
  language: Language,
  arabicFallback: ContentLanguage = "fa"
): ResolvedText | undefined {
  const clean = (lang: Language) => {
    const content = value?.[lang]?.trim();
    return content && !EMPTY_VALUE.test(content) ? { text: content, lang } : undefined;
  };
  if (language !== "ar") return clean(language);
  return clean("ar") ?? clean(arabicFallback);
}

export function textOf(value: TextValue | undefined, language: Language, arabicFallback: ContentLanguage = "fa") {
  return resolveText(value, language, arabicFallback)?.text;
}

const en = {
  brand: "BAM",
  brandLabel: "BAM Engineering Development Group — home",
  primaryNavigation: "Primary navigation",
  archiveTitle: "BAM Architecture Archive",
  archiveShort: "Archive",
  languageLabel: "Language",
  skipToContent: "Skip to content",

  footerNote: "Architectural project archive",

  categoriesLabel: "Project categories",
  categoryAll: "All",
  viewLabel: "Project view",
  viewVisual: "Visual",
  viewIndex: "Index",

  browseAllProjects: "Browse all projects",
  notFoundTitle: "Page not found",
  backToHome: "Back to the homepage",

  location: "Location",
  showLocation: "Show project location",

  exteriorPhotographs: "Exterior photographs",
  slideLabel: (position: string) => `Show photograph ${position}`,
  pauseSlideshow: "Pause slideshow",
  playSlideshow: "Play slideshow",
  exteriorAlt: (title: string, position: string) => `${title}, exterior view ${position}`,
  interiors: "Interiors",
  interiorAlt: (title: string, position: string) => `${title}, interior view ${position}`,

  projectInformation: "Project Information",
  factProjectType: "Project Type",
  factLocation: "Location",
  factCompletionYear: "Completion Year",
  factSiteArea: "Site Area",
  factBuiltUpArea: "Built-up Area",
  factGrossFloorArea: "Gross Floor Area",
  factFloors: "Floors",
  factUnits: "Units",
  factBuildings: "Buildings",
  factParking: "Parking",
  factStructure: "Structure",
  factFacade: "Facade",
  factArchitect: "Architect",
  factDeveloper: "Developer",
  factContractor: "Contractor",
  factStatus: "Status",
  squareMeters: "m²",
  listSeparator: ", ",

  // Site navigation
  navHome: "Home",
  navProjects: "Projects",
  navArchitects: "Leading Architects",
  navEvents: "Events",
  navJournal: "Journal",
  navAbout: "About BAM",
  navContact: "Contact",
  menuOpen: "Open menu",
  menuClose: "Close menu",
  menuTitle: "Menu",
  themeLabel: "Colour theme",
  themeToDark: "Switch to dark theme",
  themeToLight: "Switch to light theme",
  themeDark: "Dark",
  themeLight: "Light",

  // Homepage
  heroLabel: "Featured architecture",
  heroPrevious: "Previous project",
  heroNext: "Next project",
  heroViewProject: "View project",
  heroPosition: (current: string, total: string) => `${current} of ${total}`,
  selectedProjects: "Selected Projects",
  exploreArchive: "Explore the Architectural Archive",
  beforeAfterTitle: "A Project's Transformation",
  beforeLabel: "Before",
  afterLabel: "After",
  comparisonLabel: "Before and after comparison",
  comparisonHint: "Drag to compare",
  comparisonValue: (value: string) => `${value} of the earlier view shown`,
  beforeAlt: "The project during construction",
  afterAlt: "The completed project",
  aboutKicker: "About BAM",
  aboutReadMore: "Read more about BAM",

  // Architects
  architectsTitle: "Leading Architects",
  architectsAll: "All architects",
  viewProfile: "View profile",
  roleLeadArchitect: "Architect",
  roleInteriorArchitect: "Interior Architect",
  roleDesignConsultant: "Architectural Consultant",
  roleLandscapeArchitect: "Landscape Architect",
  bamProjects: "BAM Projects",
  relatedEvents: "Related Events",
  architectStudio: "Studio",
  architectFirm: "Practice",

  // Events
  eventsTitle: "Events & Experiences",
  eventsPageTitle: "Events",
  eventsUpcoming: "Upcoming",
  eventsOngoing: "Ongoing",
  eventsPast: "Past",
  eventsFilterLabel: "Event timing",
  eventsAll: "All events",
  eventsEmpty: "No events have been published yet.",
  eventsEmptyFiltered: "There are no events in this group.",
  viewEvent: "View event",
  eventDate: "Date",
  eventTime: "Time",
  eventLocation: "Location",
  eventOverview: "Overview",
  eventSpeakers: "Speakers & Guests",
  eventPhotos: "Photographs",
  eventVideos: "Videos",
  eventRegistration: "Registration",
  eventRegister: "Register",
  eventRegisterNote: "Registration opens on an external page.",
  relatedProjects: "Related Projects",
  relatedArchitects: "Architects",
  demoBadge: "Demo",
  demoNotice: "Temporary sample content for design review. Not a real BAM event.",

  // Journal
  activityViewCategory: (category: string) => `View in the archive: ${category}`,
  activityRelatedArticle: "Related article in the BAM Journal",
  eventsTabsLabel: "Browse events",
  eventsTabAll: "All Events",
  eventsTabPast: "Past Events",
  eventsTabUpcoming: "Upcoming Events",
  eventsEmptyUpcoming: "No upcoming events are scheduled at the moment.",
  eventsEmptyPast: "No past events have been published yet.",

  carouselPrevious: "Previous",
  carouselNext: "Next",
  architectProfile: "Architect Profile",
  bamProjectsCount: (count: string) => `BAM Projects: ${count}`,
  contactDetails: "Contact Details",
  contactPhone: "Phone",
  website: "Website",
  linkedin: "LinkedIn",
  sampleText: "Sample text",
  sampleTextNote: "Placeholder for design review. It will be replaced by the approved biography and is never published in a production build.",
  floatingContactLabel: "Contact BAM",
  instagramBam: "BAM on Instagram",
  linkedinBam: "BAM on LinkedIn",
  linkedinUnavailable: "BAM on LinkedIn (link not available yet)",
  callBam: "Call BAM",
  journalTitle: "BAM Journal",
  journalAll: "All articles",
  journalFilterLabel: "Article categories",
  readArticle: "Read article",
  journalSliderLabel: "Featured articles",
  journalSlideLabel: (position: string, total: string) => `Article ${position} of ${total}`,
  journalShowArticle: (position: string) => `Show article ${position}`,
  journalPrevious: "Previous article",
  journalNext: "Next article",
  journalPause: "Pause articles",
  journalPlay: "Play articles",
  journalDemoNote: "Sample article for design review. Not a BAM announcement.",
  publishedIn: "Published in Persian",
  originalSource: "Original publication on bamgroup.ir",
  moreFromJournal: "More from the Journal",
  journalEmpty: "No articles have been published yet.",

  // About and contact
  aboutTitle: "About BAM",
  companyName: "BAM Engineering Development Group",
  awards: "Awards",
  contactTitle: "Contact",
  contactIntro: "Contact details as published by BAM.",
  centralOffice: "Central Office",
  salesOffice: "Sales Office",
  phone: "Phone",
  email: "Email",
  address: "Address",
  workingHours: "Working hours",
  workingHoursValue: "Saturday to Wednesday, 08:00 – 17:00",
  instagram: "Instagram",
  followBam: "Follow BAM",
  openInMaps: "Open in Google Maps",
  originalInPersian: "Shown in the original Persian until an approved Arabic translation is available.",

  footerExplore: "Explore",
  footerContact: "Contact",
  footerRights: "All rights reserved.",
  footerLanguage: "Language",
  footerTop: "Back to top",

  // Metadata
  homeTitle: "BAM Engineering Development Group",
};

export type Dictionary = typeof en;

const fa: Dictionary = {
  brand: "بام",
  brandLabel: "گروه توسعه مهندسی بام — صفحه اصلی",
  primaryNavigation: "ناوبری اصلی",
  archiveTitle: "آرشیو معماری بام",
  archiveShort: "آرشیو",
  languageLabel: "زبان",
  skipToContent: "رفتن به محتوا",

  footerNote: "آرشیو پروژه‌های معماری",

  categoriesLabel: "دسته‌بندی پروژه‌ها",
  categoryAll: "همه",
  viewLabel: "نحوه نمایش پروژه‌ها",
  viewVisual: "تصویری",
  viewIndex: "فهرست",

  browseAllProjects: "مشاهده همه پروژه‌ها",
  notFoundTitle: "صفحه یافت نشد",
  backToHome: "بازگشت به صفحه اصلی",

  location: "موقعیت",
  showLocation: "نمایش موقعیت پروژه",

  exteriorPhotographs: "تصاویر نمای بیرونی",
  slideLabel: (position) => `نمایش تصویر ${position}`,
  pauseSlideshow: "توقف نمایش تصاویر",
  playSlideshow: "پخش نمایش تصاویر",
  exteriorAlt: (title, position) => `${title}، نمای بیرونی ${position}`,
  interiors: "فضاهای داخلی",
  interiorAlt: (title, position) => `${title}، فضای داخلی ${position}`,

  projectInformation: "اطلاعات پروژه",
  factProjectType: "نوع پروژه",
  factLocation: "موقعیت",
  factCompletionYear: "سال تکمیل",
  factSiteArea: "مساحت زمین",
  factBuiltUpArea: "زیربنا",
  factGrossFloorArea: "زیربنای ناخالص",
  factFloors: "تعداد طبقات",
  factUnits: "تعداد واحد",
  factBuildings: "تعداد ساختمان",
  factParking: "پارکینگ",
  factStructure: "سازه",
  factFacade: "نما",
  factArchitect: "معمار",
  factDeveloper: "توسعه‌دهنده",
  factContractor: "پیمانکار",
  factStatus: "وضعیت",
  squareMeters: "مترمربع",
  listSeparator: "، ",

  navHome: "خانه",
  navProjects: "پروژه‌ها",
  navArchitects: "معماران برتر",
  navEvents: "رویدادها",
  navJournal: "ژورنال",
  navAbout: "درباره بام",
  navContact: "تماس",
  menuOpen: "باز کردن منو",
  menuClose: "بستن منو",
  menuTitle: "منو",
  themeLabel: "حالت نمایش",
  themeToDark: "تغییر به حالت تیره",
  themeToLight: "تغییر به حالت روشن",
  themeDark: "تیره",
  themeLight: "روشن",

  heroLabel: "معماری برگزیده",
  heroPrevious: "پروژه قبلی",
  heroNext: "پروژه بعدی",
  heroViewProject: "مشاهده پروژه",
  heroPosition: (current, total) => `${current} از ${total}`,
  selectedProjects: "پروژه‌های منتخب",
  exploreArchive: "مشاهده آرشیو معماری بام",
  beforeAfterTitle: "نمایی از رشد یک پروژه",
  beforeLabel: "قبل",
  afterLabel: "بعد",
  comparisonLabel: "مقایسه قبل و بعد",
  comparisonHint: "برای مقایسه بکشید",
  comparisonValue: (value) => `${value} از نمای قبل`,
  beforeAlt: "پروژه در حین ساخت",
  afterAlt: "پروژه پس از تکمیل",
  aboutKicker: "درباره بام",
  aboutReadMore: "بیشتر درباره بام",

  architectsTitle: "معماران برتر",
  architectsAll: "همه معماران",
  viewProfile: "مشاهده پروفایل",
  roleLeadArchitect: "معمار",
  roleInteriorArchitect: "معمار داخلی",
  roleDesignConsultant: "مشاور معماری",
  roleLandscapeArchitect: "معمار منظر",
  bamProjects: "پروژه‌های بام",
  relatedEvents: "رویدادهای مرتبط",
  architectStudio: "دفتر",
  architectFirm: "شرکت",

  eventsTitle: "رویدادها و تجربه‌ها",
  eventsPageTitle: "رویدادها",
  eventsUpcoming: "پیش رو",
  eventsOngoing: "در حال برگزاری",
  eventsPast: "برگزار شده",
  eventsFilterLabel: "زمان رویداد",
  eventsAll: "همه رویدادها",
  eventsEmpty: "هنوز رویدادی منتشر نشده است.",
  eventsEmptyFiltered: "رویدادی در این گروه وجود ندارد.",
  viewEvent: "مشاهده رویداد",
  eventDate: "تاریخ",
  eventTime: "ساعت",
  eventLocation: "مکان",
  eventOverview: "معرفی",
  eventSpeakers: "سخنرانان و مهمانان",
  eventPhotos: "تصاویر",
  eventVideos: "ویدیوها",
  eventRegistration: "ثبت‌نام",
  eventRegister: "ثبت‌نام",
  eventRegisterNote: "ثبت‌نام در صفحه‌ای دیگر انجام می‌شود.",
  relatedProjects: "پروژه‌های مرتبط",
  relatedArchitects: "معماران",
  demoBadge: "نمونه",
  demoNotice: "محتوای نمونه موقت برای بررسی طراحی. این رویداد واقعی نیست.",

  activityViewCategory: (category) => `مشاهده در آرشیو: ${category}`,
  activityRelatedArticle: "مطلب مرتبط در ژورنال بام",
  eventsTabsLabel: "مرور رویدادها",
  eventsTabAll: "همه رویدادها",
  eventsTabPast: "رویدادهای برگزارشده",
  eventsTabUpcoming: "رویدادهای پیش رو",
  eventsEmptyUpcoming: "در حال حاضر رویداد پیش رویی برنامه‌ریزی نشده است.",
  eventsEmptyPast: "هنوز رویداد برگزارشده‌ای منتشر نشده است.",

  carouselPrevious: "قبلی",
  carouselNext: "بعدی",
  architectProfile: "معرفی معمار",
  bamProjectsCount: (count) => `پروژه‌های مرتبط با بام: ${count}`,
  contactDetails: "راه‌های ارتباطی",
  contactPhone: "تماس",
  website: "وب‌سایت",
  linkedin: "لینکدین",
  sampleText: "متن نمونه",
  sampleTextNote: "متن جایگزین برای بررسی طراحی. با زندگی‌نامه تأییدشده جایگزین می‌شود و هرگز در نسخه نهایی منتشر نمی‌شود.",
  floatingContactLabel: "ارتباط با بام",
  instagramBam: "بام در اینستاگرام",
  linkedinBam: "بام در لینکدین",
  linkedinUnavailable: "بام در لینکدین (پیوند هنوز در دسترس نیست)",
  callBam: "تماس با بام",
  journalTitle: "ژورنال بام",
  journalAll: "همه مطالب",
  journalFilterLabel: "دسته‌بندی مطالب",
  readArticle: "خواندن مطلب",
  journalSliderLabel: "مطالب برگزیده",
  journalSlideLabel: (position, total) => `مطلب ${position} از ${total}`,
  journalShowArticle: (position) => `نمایش مطلب ${position}`,
  journalPrevious: "مطلب قبلی",
  journalNext: "مطلب بعدی",
  journalPause: "توقف نمایش مطالب",
  journalPlay: "پخش نمایش مطالب",
  journalDemoNote: "مطلب نمونه برای بررسی طراحی. این مطلب خبر رسمی بام نیست.",
  publishedIn: "منتشرشده به فارسی",
  originalSource: "انتشار اصلی در bamgroup.ir",
  moreFromJournal: "مطالب دیگر ژورنال",
  journalEmpty: "هنوز مطلبی منتشر نشده است.",

  aboutTitle: "درباره بام",
  companyName: "گروه توسعه مهندسی بام",
  awards: "جوایز",
  contactTitle: "تماس",
  contactIntro: "اطلاعات تماس، همان‌گونه که گروه بام منتشر کرده است.",
  centralOffice: "دفتر مرکزی",
  salesOffice: "دفتر فروش",
  phone: "تلفن",
  email: "ایمیل",
  address: "نشانی",
  workingHours: "ساعات کاری",
  workingHoursValue: "شنبه تا چهارشنبه، ۸:۰۰ تا ۱۷:۰۰",
  instagram: "اینستاگرام",
  followBam: "بام را دنبال کنید",
  openInMaps: "مشاهده در نقشه گوگل",
  originalInPersian: "",

  footerExplore: "بخش‌ها",
  footerContact: "تماس",
  footerRights: "تمامی حقوق محفوظ است.",
  footerLanguage: "زبان",
  footerTop: "بازگشت به بالا",

  homeTitle: "گروه توسعه مهندسی بام",
};

const ar: Dictionary = {
  brand: "بام",
  brandLabel: "بام — الصفحة الرئيسية",
  primaryNavigation: "التنقل الرئيسي",
  archiveTitle: "أرشيف بام المعماري",
  archiveShort: "الأرشيف",
  languageLabel: "اللغة",
  skipToContent: "انتقل إلى المحتوى",

  footerNote: "أرشيف المشاريع المعمارية",

  categoriesLabel: "فئات المشاريع",
  categoryAll: "الكل",
  viewLabel: "طريقة عرض المشاريع",
  viewVisual: "مرئي",
  viewIndex: "فهرس",

  browseAllProjects: "تصفح جميع المشاريع",
  notFoundTitle: "الصفحة غير موجودة",
  backToHome: "العودة إلى الصفحة الرئيسية",

  location: "الموقع",
  showLocation: "عرض موقع المشروع",

  exteriorPhotographs: "صور الواجهات الخارجية",
  slideLabel: (position) => `عرض الصورة ${position}`,
  pauseSlideshow: "إيقاف عرض الصور",
  playSlideshow: "تشغيل عرض الصور",
  exteriorAlt: (title, position) => `${title}، منظر خارجي ${position}`,
  interiors: "المساحات الداخلية",
  interiorAlt: (title, position) => `${title}، منظر داخلي ${position}`,

  projectInformation: "معلومات المشروع",
  factProjectType: "نوع المشروع",
  factLocation: "الموقع",
  factCompletionYear: "سنة الإنجاز",
  factSiteArea: "مساحة الأرض",
  factBuiltUpArea: "المساحة المبنية",
  factGrossFloorArea: "إجمالي مساحة الطوابق",
  factFloors: "عدد الطوابق",
  factUnits: "عدد الوحدات",
  factBuildings: "عدد المباني",
  factParking: "مواقف السيارات",
  factStructure: "الهيكل الإنشائي",
  factFacade: "الواجهة",
  factArchitect: "المعماري",
  factDeveloper: "المطوّر",
  factContractor: "المقاول",
  factStatus: "الحالة",
  squareMeters: "م²",
  listSeparator: "، ",

  navHome: "الرئيسية",
  navProjects: "المشاريع",
  navArchitects: "أبرز المعماريين",
  navEvents: "الفعاليات",
  navJournal: "المجلة",
  navAbout: "عن بام",
  navContact: "اتصل بنا",
  menuOpen: "فتح القائمة",
  menuClose: "إغلاق القائمة",
  menuTitle: "القائمة",
  themeLabel: "نمط العرض",
  themeToDark: "التبديل إلى الوضع الداكن",
  themeToLight: "التبديل إلى الوضع الفاتح",
  themeDark: "داكن",
  themeLight: "فاتح",

  heroLabel: "عمارة مختارة",
  heroPrevious: "المشروع السابق",
  heroNext: "المشروع التالي",
  heroViewProject: "عرض المشروع",
  heroPosition: (current, total) => `${current} من ${total}`,
  selectedProjects: "مشاريع مختارة",
  exploreArchive: "استكشف أرشيف العمارة",
  beforeAfterTitle: "مراحل تطوّر مشروع",
  beforeLabel: "قبل",
  afterLabel: "بعد",
  comparisonLabel: "مقارنة قبل وبعد",
  comparisonHint: "اسحب للمقارنة",
  comparisonValue: (value) => `${value} من المنظر السابق`,
  beforeAlt: "المشروع أثناء البناء",
  afterAlt: "المشروع بعد الإنجاز",
  aboutKicker: "عن بام",
  aboutReadMore: "المزيد عن بام",

  architectsTitle: "أبرز المعماريين",
  architectsAll: "جميع المعماريين",
  viewProfile: "عرض الملف",
  roleLeadArchitect: "معماري",
  roleInteriorArchitect: "معماري داخلي",
  roleDesignConsultant: "استشاري معماري",
  roleLandscapeArchitect: "معماري المناظر الطبيعية",
  bamProjects: "مشاريع بام",
  relatedEvents: "فعاليات ذات صلة",
  architectStudio: "المكتب",
  architectFirm: "الشركة",

  eventsTitle: "الفعاليات والتجارب",
  eventsPageTitle: "الفعاليات",
  eventsUpcoming: "القادمة",
  eventsOngoing: "الجارية",
  eventsPast: "السابقة",
  eventsFilterLabel: "توقيت الفعالية",
  eventsAll: "جميع الفعاليات",
  eventsEmpty: "لم تُنشر أي فعاليات بعد.",
  eventsEmptyFiltered: "لا توجد فعاليات في هذه المجموعة.",
  viewEvent: "عرض الفعالية",
  eventDate: "التاريخ",
  eventTime: "الوقت",
  eventLocation: "المكان",
  eventOverview: "نظرة عامة",
  eventSpeakers: "المتحدثون والضيوف",
  eventPhotos: "الصور",
  eventVideos: "الفيديوهات",
  eventRegistration: "التسجيل",
  eventRegister: "سجّل الآن",
  eventRegisterNote: "يتم التسجيل عبر صفحة خارجية.",
  relatedProjects: "مشاريع ذات صلة",
  relatedArchitects: "المعماريون",
  demoBadge: "تجريبي",
  demoNotice: "محتوى تجريبي مؤقت لمراجعة التصميم، وليس فعالية حقيقية لبام.",

  activityViewCategory: (category) => `عرض في الأرشيف: ${category}`,
  activityRelatedArticle: "مقال ذو صلة في مجلة بام",
  eventsTabsLabel: "تصفح الفعاليات",
  eventsTabAll: "جميع الفعاليات",
  eventsTabPast: "الفعاليات السابقة",
  eventsTabUpcoming: "الفعاليات القادمة",
  eventsEmptyUpcoming: "لا توجد فعاليات قادمة مجدولة حاليًا.",
  eventsEmptyPast: "لم تُنشر أي فعاليات سابقة بعد.",

  carouselPrevious: "السابق",
  carouselNext: "التالي",
  architectProfile: "الملف الشخصي للمعماري",
  bamProjectsCount: (count) => `مشاريع بام: ${count}`,
  contactDetails: "وسائل التواصل",
  contactPhone: "الهاتف",
  website: "الموقع الإلكتروني",
  linkedin: "لينكدإن",
  sampleText: "نص تجريبي",
  sampleTextNote: "نص مؤقت لمراجعة التصميم، سيُستبدل بالسيرة المعتمدة ولا يُنشر أبدًا في النسخة النهائية.",
  floatingContactLabel: "تواصل مع بام",
  instagramBam: "بام على إنستغرام",
  linkedinBam: "بام على لينكدإن",
  linkedinUnavailable: "بام على لينكدإن (الرابط غير متاح بعد)",
  callBam: "اتصل ببام",
  journalTitle: "مجلة بام",
  journalAll: "جميع المقالات",
  journalFilterLabel: "فئات المقالات",
  readArticle: "اقرأ المقال",
  journalSliderLabel: "مقالات مختارة",
  journalSlideLabel: (position, total) => `المقال ${position} من ${total}`,
  journalShowArticle: (position) => `عرض المقال ${position}`,
  journalPrevious: "المقال السابق",
  journalNext: "المقال التالي",
  journalPause: "إيقاف عرض المقالات",
  journalPlay: "تشغيل عرض المقالات",
  journalDemoNote: "مقال تجريبي لمراجعة التصميم، وليس خبرًا رسميًا من بام.",
  publishedIn: "منشور باللغة الفارسية",
  originalSource: "النشر الأصلي على bamgroup.ir",
  moreFromJournal: "المزيد من المجلة",
  journalEmpty: "لم تُنشر أي مقالات بعد.",

  aboutTitle: "عن بام",
  // The verified Persian name stays until an approved Arabic name exists.
  companyName: "گروه توسعه مهندسی بام",
  awards: "الجوائز",
  contactTitle: "اتصل بنا",
  contactIntro: "بيانات الاتصال كما نشرتها مجموعة بام.",
  centralOffice: "المكتب الرئيسي",
  salesOffice: "مكتب المبيعات",
  phone: "الهاتف",
  email: "البريد الإلكتروني",
  address: "العنوان",
  workingHours: "ساعات العمل",
  workingHoursValue: "من السبت إلى الأربعاء، 08:00 – 17:00",
  instagram: "إنستغرام",
  followBam: "تابع بام",
  openInMaps: "افتح في خرائط Google",
  originalInPersian: "يُعرض النص بلغته الفارسية الأصلية إلى حين توفّر ترجمة عربية معتمدة.",

  footerExplore: "استكشف",
  footerContact: "اتصل بنا",
  footerRights: "جميع الحقوق محفوظة.",
  footerLanguage: "اللغة",
  footerTop: "العودة إلى الأعلى",

  homeTitle: "گروه توسعه مهندسی بام",
};

export const dictionary: Record<Language, Dictionary> = { en, fa, ar };
