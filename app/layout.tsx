import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { DocumentPreferences } from "@/components/DocumentPreferences";
import { FloatingContact } from "@/components/FloatingContact";
import { SkipLink } from "@/components/SkipLink";
import { preferenceBootScript } from "@/lib/preferences";
import "./globals.css";
import "./styles/site.css";
import "./styles/home.css";
import "./styles/pages.css";

// The active language chooses between these in globals.css (--font-body).
const lato = localFont({
  src: [{ path: "./fonts/lato/Lato-Regular.ttf", weight: "400", style: "normal" }],
  variable: "--font-lato",
  display: "swap",
});

// Persian and Arabic. The browser only fetches these once such text is on the page.
const iranSansX = localFont({
  src: [
    { path: "./fonts/iransansx/IRANSansX-Regular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/iransansx/IRANSansX-Medium.ttf", weight: "500", style: "normal" },
  ],
  variable: "--font-iransansx",
  display: "swap",
  preload: false,
});

// Set NEXT_PUBLIC_SITE_URL for the deployment; canonical and Open Graph URLs use it.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://bamgroup.ir";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "BAM Engineering Development Group", template: "%s — BAM" },
  description:
    "BAM Engineering Development Group: architecture, engineering and construction of residential, commercial, medical and large-scale projects.",
  openGraph: {
    type: "website",
    siteName: "BAM Engineering Development Group",
    locale: "en_US",
    alternateLocale: ["fa_IR", "ar"],
    images: [{ url: "/projects/bamland/exterior/exterior-02.jpg", width: 2800, height: 1867 }],
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#1d1d1b" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" dir="ltr" className={`${lato.variable} ${iranSansX.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: preferenceBootScript }} />
      </head>
      <body>
        <SkipLink />
        <DocumentPreferences />
        {children}
        <FloatingContact />
      </body>
    </html>
  );
}
