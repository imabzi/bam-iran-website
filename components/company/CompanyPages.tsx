"use client";

import Image from "next/image";
import { company, contact } from "@/data/company";
import { aboutImage } from "@/data/home";
import { approvedLocations } from "@/data/projectLocations";
import { getProjectByCode } from "@/data/projects";
import { formatNumber, resolveText, textOf } from "@/lib/i18n";
import { useDocumentTitle, useLanguage } from "@/lib/usePreferences";
import { Header } from "../Header";
import { InstagramIcon } from "../Icons";
import { SiteFooter } from "../SiteFooter";
import { LocalizedText, Ltr, telHref } from "../Text";
import { PageIntro, TextLink } from "../ui";
import { AwardsPreview } from "../awards/Awards";
import { BrandMark } from "../BrandMark";
import { CeoMessage } from "../corporate/CeoMessage";
import { EngineeringExcellence } from "../corporate/Engineering";
import { HistoryTimeline } from "../history/HistoryTimeline";
import { BamActivities } from "../home/BamActivities";
import { milestoneKindLabels, milestones } from "@/data/history";

export function AboutPage() {
  const { language, t } = useLanguage();
  useDocumentTitle(`${t.aboutTitle} — ${t.brand}`);
  const heading = resolveText(company.aboutHeading, language);
  const paragraphs = company.about.map((paragraph) => resolveText(paragraph, language)).filter((paragraph) => paragraph !== undefined);
  const fallback = paragraphs.some((paragraph) => paragraph.lang !== language);
  const project = getProjectByCode(aboutImage.projectCode);

  return (
    <>
      <Header />
      <main id="main" className="inner-page">
        <PageIntro kicker={t.aboutTitle} title={t.companyName} />
        <div className="container">
          <figure className="about-hero">
            <div className="about-hero-frame">
              <Image src={aboutImage.src} alt={project ? textOf(project.title, language) ?? "" : ""} fill priority sizes="(max-width: 1760px) 100vw, 1680px" className="about-image" />
            </div>
            {project && <figcaption className="media-caption">{textOf(project.title, language) ?? project.title.fa}</figcaption>}
          </figure>
        </div>
        <section className="container about-body-grid">
          <div className="about-identity">
            {heading && (
              <h2 className="section-title section-title-small" lang={heading.lang !== language ? heading.lang : undefined}>
                {heading.text}
              </h2>
            )}
            <BrandMark className="about-logo" alt={t.companyName} sizes="(max-width: 900px) 40vw, 220px" />
          </div>
          <div className="prose" lang={fallback ? "fa" : undefined}>
            {paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph.text}</p>
            ))}
            {fallback && <p className="fallback-note" lang={language}>{t.originalInPersian}</p>}
            <div className="prose-actions">
              <TextLink href="/contact">{t.navContact}</TextLink>
            </div>
          </div>
        </section>
        <HistoryTimeline variant="full" />
        <BamActivities />
        <EngineeringExcellence variant="full" />
        <AwardsPreview />
        <CeoMessage />
        <FutureVision />
      </main>
      <SiteFooter />
    </>
  );
}

// The future milestones of the shared history, as the closing statement of the
// About page. Each keeps its "plan" or "vision" label.
function FutureVision() {
  const { language, t } = useLanguage();
  const future = milestones.filter((milestone) => milestone.kind !== "history" && resolveText(milestone.heading, language));
  if (future.length === 0) return null;
  return (
    <section className="section future-vision" aria-labelledby="future-vision-title">
      <div className="container">
        <span className="kicker">{t.aboutVision}</span>
        <h2 id="future-vision-title" className="visually-hidden">{t.aboutVision}</h2>
        <ol className="vision-list">
          {future.map((milestone) => {
            const heading = resolveText(milestone.heading, language);
            const text = resolveText(milestone.text, language);
            const kind = milestone.kind === "history" ? undefined : resolveText(milestoneKindLabels[milestone.kind], language);
            return (
              <li key={milestone.id} className="vision-item">
                <p className="vision-year">{formatNumber(milestone.years[0], language, { useGrouping: false })}</p>
                <div>
                  {kind && <span className="step-kind" data-kind={milestone.kind}>{kind.text}</span>}
                  <h3 className="vision-heading">{heading?.text}</h3>
                  {text && <p className="vision-text">{text.text}</p>}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

export function ContactPage() {
  const { language, t } = useLanguage();
  useDocumentTitle(`${t.contactTitle} — ${t.brand}`);
  const mapsUrl = approvedLocations.T01?.googleMapsUrl;

  return (
    <>
      <Header />
      <main id="main" className="inner-page">
        <PageIntro title={t.contactTitle}>
          <p className="page-lead">{t.contactIntro}</p>
        </PageIntro>
        <section className="container contact-grid">
          <div className="contact-block">
            <h2 className="contact-heading">{t.centralOffice}</h2>
            <dl className="contact-list">
              <div>
                <dt>{t.address}</dt>
                <dd>
                  <LocalizedText value={contact.centralOffice.address} language={language} />
                  {mapsUrl && (
                    <span className="contact-map">
                      <TextLink href={mapsUrl} external>{t.openInMaps}</TextLink>
                    </span>
                  )}
                </dd>
              </div>
              <div>
                <dt>{t.phone}</dt>
                <dd>
                  {contact.centralOffice.phones.map((phone) => (
                    <a key={phone} href={telHref(phone)}><Ltr>{phone}</Ltr></a>
                  ))}
                </dd>
              </div>
              <div>
                <dt>{t.email}</dt>
                <dd><a href={`mailto:${contact.centralOffice.email}`}><Ltr>{contact.centralOffice.email}</Ltr></a></dd>
              </div>
              <div>
                <dt>{t.workingHours}</dt>
                <dd>{t.workingHoursValue}</dd>
              </div>
            </dl>
          </div>
          <div className="contact-block">
            <h2 className="contact-heading">{t.salesOffice}</h2>
            <dl className="contact-list">
              <div>
                <dt>{t.phone}</dt>
                <dd>
                  {contact.salesOffice.phones.map((phone) => (
                    <a key={phone} href={telHref(phone)}><Ltr>{phone}</Ltr></a>
                  ))}
                </dd>
              </div>
              <div>
                <dt>{t.email}</dt>
                <dd><a href={`mailto:${contact.salesOffice.email}`}><Ltr>{contact.salesOffice.email}</Ltr></a></dd>
              </div>
            </dl>
            <h2 className="contact-heading contact-heading-spaced">{t.followBam}</h2>
            <a className="footer-social contact-social" href={contact.social[0].url} target="_blank" rel="noopener noreferrer">
              <InstagramIcon />
              <span>{t.instagram}</span>
            </a>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
