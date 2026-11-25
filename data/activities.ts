import type { TextValue } from "@/lib/i18n";
import type { CategoryId } from "./projects";

// "فعالیت ها و پروژه های گروه بام" — the activities section of BAM's official
// homepage (https://bamgroup.ir/ and https://bamgroup.ir/en/), copied verbatim
// by script on 25 November 2026. Titles and descriptions are exactly as
// published in Persian and English, typos included; do not reword them.
//
// Arabic: the five generic titles have interface translations. "گنج پنهان"
// (Hidden Treasure) is a programme name and keeps its Persian form. The
// descriptions have no approved Arabic text, so Arabic shows the Persian
// original (see resolveText in lib/i18n.ts).
//
// These six areas are BAM's lines of activity. They are NOT the archive's five
// project categories, although some link to the closest archive category.

export type ActivityIllustration = "residential" | "office" | "healthcare" | "leisure" | "mass-housing" | "hidden-treasure";

export type Activity = {
  id: string;
  title: TextValue;
  description: TextValue;
  // An existing photograph of a BAM project of this kind. Left out where no
  // archive project is a verified example (mass housing, Hidden Treasure).
  image?: { projectCode: string; src: string; position?: string };
  // Shown when there is no photograph.
  illustration: ActivityIllustration;
  // A real destination: an archive category, or the journal article filed
  // under Hidden Treasure on the official site.
  link?: { href: string; category?: CategoryId; article?: boolean };
};

export const activitiesHeading: TextValue = {
  fa: "فعالیت ها و پروژه های گروه بام",
  en: "Activities & Projects of Bam Group",
  ar: "أنشطة ومشاريع مجموعة بام",
};

export const activities: Activity[] = [
  {
    id: "residential",
    title: { fa: "ساختمان های مسکونی", en: "Residential buildings", ar: "المباني السكنية" },
    description: { fa: "گروه توسعه مهندسی بام یکی از خوشنام ترین و معتبرترین گروه های صنعت ساختمان است که توانسته ساختمان های بی نظیری را در تهران طراحی و اجرا کند .", en: "Bam Engineering Development Group is one of the most famous and reliable groups in the construction industry, which has been able to design and implement unique buildings in Tehran." },
    image: { projectCode: "R15", src: "/projects/bam-sepid/exterior/exterior-02.jpg", position: "50% 50%" },
    illustration: "residential",
    link: { href: "/projects?category=residential", category: "residential" },
  },
  {
    id: "office-commercial",
    title: { fa: "مراکز اداری و تجاری", en: "Administrative & Commercial Center", ar: "المراكز الإدارية والتجارية" },
    description: { fa: "با توجه به مشکلات شهرنشینی از قبیل ترافیک و آلودگی هوا مراکز اداری- تجاری که به لحاظ جغرافیایی در محل های مناسبی با دسترسی های فراوان قرار دارند و به لحاظ طراحی، معماری و ساخت حس امنیت،آرامش و نشاط را انتقال می دهند نیاز شهروندان است. گروه توسعه  مهندسی بام با طراحی و ساخت این مراکز سعی در رفع مشکلات شهروندان داشته است.", en: "Considering the problems of urbanization, such as traffic and air pollution, administrative-commercial centers that are geographically located in suitable places with many accesses and in terms of design, architecture and construction convey a sense of security, peace and vitality are the needs of the citizens. . Bam Engineering Development Group has tried to solve the problems of citizens by designing and building these centers." },
    image: { projectCode: "T05", src: "/projects/bam-center-yeganeh/exterior/exterior-01.jpg", position: "58% 50%" },
    illustration: "office",
    link: { href: "/projects?category=commercial-leisure", category: "commercial-leisure" },
  },
  {
    id: "healthcare",
    title: { fa: "بیمارستان، مراکز بهداشتی و درمانی", en: "Health & Care Center", ar: "المستشفيات والمراكز الصحية والعلاجية" },
    description: { fa: "احداث بیمارستان های بزرگ و مجهز به تکنولوژی های روز دنیا و رعایت استانداردهای جهانی بیمارستان سازی و توسعه مراکز درمانی امریست بسی دشوار، که شرکت های ساختمان سازی معدودی در ایران قادر به انجام آن هستند.", en: "It is very difficult to build large hospitals equipped with modern technologies and comply with international standards of hospital construction and development of medical centers, which few construction companies in Iran are able to do." },
    image: { projectCode: "H08", src: "/projects/nikan-clinic/exterior/exterior-01.jpg", position: "62% 50%" },
    illustration: "healthcare",
    link: { href: "/projects?category=healthcare", category: "healthcare" },
  },
  {
    id: "leisure-culture-tourism",
    title: { fa: "مراکز تفریحی ، فرهنگی و گردشگری", en: "Commercial, Entertainment, Cultural & Tourism Center", ar: "المراكز الترفيهية والثقافية والسياحية" },
    description: { fa: "امروزه با رشد فزاینده جمعیت و افزایش بافت ساخته شده در شهرها، لزوم توجه به طراحی فضاهای باز شهری از پارک های شهری تا فضاهای خرد مقیاس در میان ساختمان ها، همچنین بهره گیری از عناصر طبیعی برای برآورده نمودن نیاز انسان به ارتباط با طبیعت، بیش از هر زمانی احساس می شود.", en: "Today, with the increasing population growth and the increase of the built structure in cities, the need to pay attention to the design of urban open spaces from urban parks to small-scale spaces between buildings, as well as the use of natural elements to meet the human need to connect with nature, is more It can be felt from any time." },
    image: { projectCode: "T08", src: "/projects/bam-equestrian-club/exterior/exterior-01.jpg", position: "60% 50%" },
    illustration: "leisure",
    link: { href: "/projects?category=commercial-leisure", category: "commercial-leisure" },
  },
  {
    id: "mass-housing",
    title: { fa: "پروژه های انبوه سازی", en: "Mass Housing", ar: "مشاريع الإسكان الجماعي" },
    description: { fa: "گروه توسعه مهندسی بام با اتکا به نیروهای متخصص، کار آزموده و عملیاتی پروژه های متعدد انبوه سازی را توسط مدیریت متمرکز شرکت مکان شهر که از شرکت های وابسته به گروه بام است، اجرا کرده است.", en: "Relying on expert forces, Bam Engineering Development Group has implemented the tested and operational work of numerous mass construction projects by the centralized management of Makan Shahr Company, which is one of the affiliated companies of Bam Group." },
    image: undefined,
    illustration: "mass-housing",
    link: { href: "/projects?category=large-scale", category: "large-scale" },
  },
  {
    id: "hidden-treasure",
    title: { fa: "پروژه گنج پنهان", en: "Hidden Treasure" },
    description: { fa: "گروه توسعه مهندسی بام یکی از بزرگ ترین و شناخته شده ترین شرکت های ساختمانی در کشور می باشد، که داری بهره وری بالایی است و سهم عظیمی در پروژه گنج پنهان دارند.", en: "Bam Engineering Development Group is one of the largest and most well-known construction companies in the country, which has high productivity and has a huge contribution to the hidden treasure project." },
    image: undefined,
    illustration: "hidden-treasure",
    link: { href: "/journal/ceo-visit-historic-urban-fabric", article: true },
  },
];
