"use client";

import Image from "next/image";
import { company, contact } from "@/data/company";
import { aboutImage } from "@/data/home";
import { approvedLocations } from "@/data/projectLocations";
import { getProjectByCode } from "@/data/projects";
import { resolveText, textOf } from "@/lib/i18n";
import { useDocumentTitle, useLanguage } from "@/lib/usePreferences";
import { Header } from "../Header";
import { InstagramIcon } from "../Icons";
import { SiteFooter } from "../SiteFooter";
import { LocalizedText, Ltr, telHref } from "../Text";
import { PageIntro, TextLink } from "../ui";

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
          <div>
            {heading && (
              <h2 className="section-title section-title-small" lang={heading.lang !== language ? heading.lang : undefined}>
                {heading.text}
              </h2>
            )}
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
      </main>
      <SiteFooter />
    </>
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
