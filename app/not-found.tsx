"use client";

import Link from "next/link";
import { ArrowIcon } from "@/components/ArrowIcon";
import { Header } from "@/components/Header";
import { SiteFooter } from "@/components/SiteFooter";
import { useDocumentTitle, useLanguage } from "@/lib/usePreferences";

export default function NotFound() {
  const { t } = useLanguage();
  useDocumentTitle(`${t.notFoundTitle} — ${t.brand}`);

  return (
    <>
      <Header />
      <main id="main" className="detail-page">
        <section className="detail-intro not-found">
          <Link href="/" className="back-link">
            <ArrowIcon />
            <span>{t.backToHome}</span>
          </Link>
          <h1 className="detail-title">{t.notFoundTitle}</h1>
          <p className="not-found-links">
            <Link href="/projects" className="text-link">{t.archiveTitle}</Link>
          </p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
