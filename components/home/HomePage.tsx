"use client";

import { useDocumentTitle, useLanguage } from "@/lib/usePreferences";
import { Header } from "../Header";
import { SiteFooter } from "../SiteFooter";
import { AboutPreview } from "./AboutPreview";
import { BamActivities } from "./BamActivities";
import { FeaturedProjects } from "./FeaturedProjects";
import { HomeHero } from "./HomeHero";
import { ArchitectsPreview, EventsPreview, JournalPreview } from "./HomeSections";

export function HomePage() {
  const { t } = useLanguage();
  useDocumentTitle(t.homeTitle);

  return (
    <>
      <Header overlay />
      <main id="main" className="home">
        <h1 className="visually-hidden">{t.companyName}</h1>
        <HomeHero />
        <FeaturedProjects />
        <BamActivities />
        <AboutPreview />
        <ArchitectsPreview />
        <EventsPreview />
        <JournalPreview />
      </main>
      <SiteFooter />
    </>
  );
}
