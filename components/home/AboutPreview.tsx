"use client";

import Image from "next/image";
import { company } from "@/data/company";
import { aboutImage } from "@/data/home";
import { getProjectByCode } from "@/data/projects";
import { resolveText, textOf } from "@/lib/i18n";
import { useLanguage } from "@/lib/usePreferences";
import { TextLink } from "../ui";

export function AboutPreview() {
  const { language, t } = useLanguage();
  const excerpt = resolveText(company.excerpt, language);
  const project = getProjectByCode(aboutImage.projectCode);

  return (
    <section className="section home-about" aria-labelledby="about-title">
      <div className="container about-grid">
        <div className="about-copy">
          <span className="kicker">{t.aboutKicker}</span>
          <h2 id="about-title" className="section-title">{t.companyName}</h2>
          {excerpt && (
            <p className="about-excerpt" lang={excerpt.lang !== language ? excerpt.lang : undefined}>
              {excerpt.text}
            </p>
          )}
          <TextLink href="/about">{t.aboutReadMore}</TextLink>
        </div>
        <figure className="about-media">
          <div className="about-image-frame">
            <Image
              src={aboutImage.src}
              alt={project ? textOf(project.title, language) ?? project.title.en : ""}
              fill
              sizes="(max-width: 900px) 100vw, 58vw"
              className="about-image"
              style={{ objectPosition: aboutImage.position }}
            />
          </div>
          {project && (
            <figcaption className="media-caption">
              {textOf(project.title, language) ?? project.title.en}
            </figcaption>
          )}
        </figure>
      </div>
    </section>
  );
}
