import type { TextValue } from "@/lib/i18n";

// BAM's corporate content, copied verbatim from the official website on
// 25 November 2026. CONTENT_INVENTORY.md lists each source page. Do not reword:
// the text is shown exactly as published. Long passages may be split into
// paragraphs at sentence boundaries, and an excerpt may stop early with "…",
// but no word is changed.

export const officialSite = "https://bamgroup.ir/";

export const company = {
  name: { en: "BAM Engineering Development Group", fa: "گروه توسعه مهندسی بام" } satisfies TextValue,

  // The heading the official About pages use above the description.
  aboutHeading: { en: "Bam Group", fa: "گروه بام" } satisfies TextValue,

  // https://bamgroup.ir/گروه-بام/ and https://bamgroup.ir/en/bam-group/ — split at sentence boundaries.
  // Note: the English award years do not match the Persian Solar Hijri years
  // (for example 1389 is given as 2019). Shown as published; see CONTENT_INVENTORY.md.
  about: [
    { fa: "یکی از موفق ترین گروه های صنعت ساختمان در ایران است که با بهره گیری از تیم های مهندسی توانمند و کارآمد، طراحان خلاق و زبردست و فنآوری های نوین ساخت، ایجاد کیفیت برتر را در انواع ساختمان های مسکونی لوکس، مراکز اداری، تجاری و رفاهی، انبوه سازی و مراکز بهداشتی درمانی، به عنوان برگی زرین در کارنامه افتخارات خود دارد. این گروه در حال حاضر با ترکیبی از فعالیت های تخصصی در قالب شرکت های زیر مجموعه در نقاط مختلف کشور از عسلویه در جنوب شرق تا مشکین شهر در شمال غرب کشور مشغول فعالیت مهندسی و اجراست.", en: "It is one of the most successful groups in the construction industry in Iran, which, by using capable and efficient engineering teams, creative and great designers, and modern construction technologies, creates superior quality in all kinds of luxury residential buildings, office, commercial and welfare centers. , massification and health care centers, as a golden leaf in his record of honors. This group is currently engaged in engineering and implementation activities with a combination of specialized activities in the form of subsidiary companies in different parts of the country from Asaluyeh in the southeast to Meshkinshahr in the northwest of the country." },
    { fa: "ایجاد مدیریت توسعه گرا و پویا از مرحله شناسایی موقعیت مکانی مناسب تا ساخت و خدمات دوره بهره برداری از اهداف کلیدی گروه توسعه مهندسی بام بوده و در نظر است تا با حضور چشمگیر در عرصه های مختلف ساخت و ساز و ارئه خدمات برتر با کیفیت بهتر، به عنوان الگو و برند برتر در سطح کشور شناخته شود. استفاده از نیروی انسانی هوشمند، متخصص و با تجربه، استقبال از ایده ها و طرح های نو و خلاقانه و حضور در عرصه های بین المللی از راهکار های گروه برای رسیدن اهداف از پیش تعیین شده است.", en: "Creating development-oriented and dynamic management, from the stage of identifying a suitable location to construction and operation period services, is one of the key goals of Bam Engineering Development Group, and it is intended to achieve significant presence in various fields of construction and providing superior services with better quality. To be recognized as the best model and brand in the country. The use of intelligent, expert and experienced human resources, welcoming new and creative ideas and plans, and presence in international arenas are among the solutions of the group to achieve predetermined goals." },
    { fa: "گروه بام مفتخر به دریافت تندیس بهترین انبوه ساز کشور در سال 1389، جایزه بهترین مدرن ساز کشور در سال 1390 (PRED)، تندیس افتخار همایش نام آوران عرصه ساخت و ساز در سال 1390، جایزه بین المللی کیفیت BID لندن، انگلستان در سال 1391، جایزه بین المللی کیفیت و اعتبار کسب و کار otherway رم، ایتالیا در سال 1392، برترین مرکز عرصه سازندگی کشور در سال 1394،  تندیس مدیر برگزیده جهادی عرصه سازندگی در حوزه مدیریت سازندگی ساختمان های لوکس و مدرن کشور در سال 1394، دریافت نشان برگزیده ویژه ابر پیمانکار تخصصی در صنعت ساختمان و انبوه سازی و نشان عالی نوآوری در طراحی، معماری و اجرای پروژه های ساختمانی در سال 1395 می باشد.", en: "Bam Group is proud to receive the statue of the best mass builder in the country in 2019, the award of the best modernizer in the country in 2010 (PRED), the statue of honor of the conference of names in the construction field in 2010, the international quality award of BID London, England in 2011 Otherway international business credit and quality award Rome, Italy in 2013, the best center of the country’s construction field in 2014, the statue of the selected Jihadi manager of the construction field in the field of construction management of luxury and modern buildings in the country in 2014, receiving the selected badge It is special for the specialized super contractor in the construction and mass production industry and the excellent sign of innovation in the design, architecture and implementation of construction projects in 2015." },
  ] satisfies TextValue[],

  // Unchanged excerpts for the homepage and footer.
  // fa: the footer sentence on every official page. en: the start of the English
  // homepage introduction, stopped before its broken punctuation.
  excerpt: {
    fa: "گروه بام یکی از موفق ترین گروه های صنعت ساختمان در ایران است که با بهره گیری از تیم های مهندسی توانمند و کارآمد، طراحان خلاق و زبردست و فنآوری های نوین ساخت، ایجاد کیفیت برتر را در انواع ساختمان های مسکونی لوکس، مراکز اداری، تجاری و رفاهی، انبوه سازی و مراکز بهداشتی درمانی، به عنوان برگی زرین در کارنامه افتخارات خود دارد.",
    en: "Bam Engineering Group is one of the most successful groups in the construction industry in Iran, which, by using powerful and efficient engineering teams, creative and great designers, and new construction technologies, creates superior quality in all kinds of luxury residential buildings…",
  } satisfies TextValue,

  sources: {
    aboutFa: "https://bamgroup.ir/گروه-بام/",
    aboutEn: "https://bamgroup.ir/en/bam-group/",
    contactFa: "https://bamgroup.ir/ارتباط-با-ما/",
    contactEn: "https://bamgroup.ir/en/contact-us/",
  },
};

// From the official contact pages and site header.
export const contact = {
  centralOffice: {
    address: {
      fa: "تهران، بلوار اندرزگو، خیابان وطن پور شمالی ،پلاک 5",
      en: "No. 5, North Vatanpoor St. Andarzgoo Blvd.Tehran, Iran",
    } satisfies TextValue,
    phones: ["021-22683298", "021-22683385"],
    email: "info@bamgroup.ir",
  },
  salesOffice: {
    phones: ["021-22685171", "021-22685191"],
    email: "sales@bamgroup.ir",
  },
  // "Sat - Wed: 8:00 - 17:00" in the official header. Formatted per language in lib/i18n.ts.
  workingHours: { days: "sat-wed", from: "08:00", to: "17:00" },
  // The only social link on the official site with a real destination.
  social: [{ id: "instagram", url: "https://www.instagram.com/bamgroupiran/" }],
  // BAM's LinkedIn page. NOT YET SUPPLIED: bamgroup.ir publishes no LinkedIn
  // link. Add the approved URL here; until then the LinkedIn icon is hidden.
  linkedin: undefined as string | undefined,
};

// "نمایی از رشد یک پروژه" — the before/after feature on the official Persian homepage.
// The project is not named there, so it is not named here either. The text exists
// only in Persian; the images were copied from the official media library.
export const transformation = {
  title: { fa: "نمایی از رشد یک پروژه" } satisfies TextValue,
  paragraphs: [
    { fa: "در این تصویر، تحول چشمگیر پروژه را از وضعیت اولیه تا شکل نهایی مشاهده می‌کنید. هر جزئیات از طراحی تا اجرا با دقت و خلاقیت برنامه‌ریزی شده تا نتیجه‌ای ماندگار خلق شود." },
    { fa: "در مرحله قبل، فضا ساده و بی‌روح بود، اما با اجرای طرح جدید، جان تازه‌ای به محیط داده شد. ترکیب رنگ‌ها، نورپردازی و انتخاب متریال‌ها به گونه‌ای انجام شد که حس گرما و زندگی در فضا جریان یابد. در این پروژه تلاش کردیم تعادلی میان زیبایی، عملکرد و دوام برقرار کنیم. هدف اصلی ما خلق فضایی بود که نه‌تنها چشم‌نواز باشد، بلکه تجربه‌ای راحت و دلپذیر برای استفاده‌کنندگان فراهم آورد. از بازسازی نما تا طراحی داخلی، همه بخش‌ها با دقت مهندسی و هنر طراحی تلفیق شده‌اند. نتیجه نهایی، نمایانگر تفاوتی بنیادین میان گذشته و اکنون است؛ تغییری که نشان می‌دهد جزئیات کوچک می‌توانند تصویری بزرگ بیافرینند. پروژه‌ای که با افتخار آن را نمادی از کیفیت و تعهد گروه بام می‌دانیم." },
  ] satisfies TextValue[],
  before: { src: "/home/before-after/before.jpg", width: 539, height: 319 },
  after: { src: "/home/before-after/after.jpg", width: 1600, height: 955 },
  sources: {
    before: "https://bamgroup.ir/wp-content/uploads/2025/10/MB__7958_564283-e1761120904822.jpg",
    after: "https://bamgroup.ir/wp-content/uploads/2025/05/02.07.20_01-scaled-e1761119697835.jpg",
  },
};
