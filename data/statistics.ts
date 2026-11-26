import type { TextValue } from "@/lib/i18n";
import { publishedAwards } from "./awards";
import { foundingYear } from "./history";

// BAM in Numbers. Only approved or derived values are published. A metric
// without an approved value stays here with `publication: "pending"` and is
// not shown: never fill it with an estimate or with a count of archive records,
// which is not BAM's historical total.

export type MetricIcon = "area" | "years" | "projects" | "units" | "awards";

export type Metric = {
  id: string;
  value?: number;
  prefix?: TextValue; // e.g. "بیش از"
  unit?: TextValue;
  label: TextValue;
  note?: TextValue;
  icon: MetricIcon;
  publication: "published" | "pending";
  source: string;
};

// Inlined at build time (next.config.ts), so the server and the browser agree.
const buildYear = Number(process.env.BAM_BUILD_YEAR) || foundingYear;

export const statisticsIntro = {
  kicker: { fa: "بام در یک نگاه" } satisfies TextValue,
  title: { fa: "مقیاس تجربه بام" } satisfies TextValue,
};

export const metrics: Metric[] = [
  {
    id: "construction-scale",
    value: 10,
    prefix: { fa: "بیش از" },
    unit: { fa: "میلیون مترمربع" },
    label: { fa: "ساخت‌وساز و توسعه" },
    icon: "area",
    publication: "published",
    source: "BAM management, 1405 website update",
  },
  {
    id: "years",
    value: buildYear - foundingYear,
    unit: { fa: "سال" },
    label: { fa: "فعالیت از تأسیس بام" },
    note: { fa: "تأسیس در تهران، ۲۰۰۴ میلادی" },
    icon: "years",
    publication: "published",
    source: "Years since the founding of BAM in 2004 (data/history.ts)",
  },
  {
    // Awaiting BAM's official completed-project count.
    id: "completed-projects",
    label: { fa: "پروژه تکمیل‌شده" },
    icon: "projects",
    publication: "pending",
    source: "To be supplied by BAM",
  },
  {
    // Awaiting BAM's official total of delivered units.
    id: "delivered-units",
    label: { fa: "واحد تحویل‌شده" },
    icon: "units",
    publication: "pending",
    source: "To be supplied by BAM",
  },
  {
    id: "awards",
    value: publishedAwards.length,
    unit: { fa: "جایزه" },
    label: { fa: "ملی و بین‌المللی" },
    note: { fa: "۲۰۱۰ تا ۲۰۱۶ میلادی" },
    icon: "awards",
    publication: "published",
    source: "Count of the published awards in data/awards.ts",
  },
];

export const publishedMetrics = metrics.filter((metric) => metric.publication === "published" && metric.value !== undefined);
