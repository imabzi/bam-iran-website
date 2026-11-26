"use client";

import { useDocumentTitle, useLanguage } from "@/lib/usePreferences";
import { AwardsPreview } from "../awards/Awards";
import { BamStatistics } from "../corporate/BamStatistics";
import { EngineeringExcellence } from "../corporate/Engineering";
import { Header } from "../Header";
import { HistoryTimeline } from "../history/HistoryTimeline";
import { SiteFooter } from "../SiteFooter";
import { TeamPreview } from "../team/Team";
import { AboutPreview } from "./AboutPreview";
import { FeaturedProjects } from "./FeaturedProjects";
import { HomeHero } from "./HomeHero";
import { ArchitectsPreview, EventsPreview, JournalPreview } from "./HomeSections";

// The homepage story: identity, scale, who BAM is, the work, how it is
// built, where it came from, recognition, people, then events and news.
// BAM's areas of activity moved to the About page, which they introduce.
export function HomePage() {
  const { t } = useLanguage();
  useDocumentTitle(t.homeTitle);

  return (
    <>
      <Header overlay />
      <main id="main" className="home">
        <h1 className="visually-hidden">{t.companyName}</h1>
        <HomeHero />
        <BamStatistics />
        <AboutPreview />
        <FeaturedProjects />
        <EngineeringExcellence />
        <HistoryTimeline />
        <AwardsPreview />
        <TeamPreview />
        <ArchitectsPreview />
        <EventsPreview />
        <JournalPreview />
      </main>
      <SiteFooter />
    </>
  );
}
