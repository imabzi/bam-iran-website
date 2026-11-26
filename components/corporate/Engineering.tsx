"use client";

import Image from "next/image";
import Link from "next/link";
import { engineeringIntro, engineeringPillars } from "@/data/engineering";
import { getProjectByCode, projectTitle } from "@/data/projects";
import { formatNumber, resolveText } from "@/lib/i18n";
import { useLanguage } from "@/lib/usePreferences";
import { TextLink } from "../ui";

/**
 * Engineering Excellence: one photograph of a BAM project, an editorial
 * column, and four numbered capabilities on a drawing-sheet rule. `home` links
 * on to the About page; `full` is that fuller About section (#engineering).
 */
export function EngineeringExcellence({ variant = "home" }: { variant?: "home" | "full" }) {
  const { language, t } = useLanguage();
  const title = resolveText(engineeringIntro.title, language);
  const subtitle = resolveText(engineeringIntro.subtitle, language);
  const kicker = resolveText(engineeringIntro.kicker, language);
  const caption = resolveText(engineeringIntro.image.caption, language);
  const pillars = engineeringPillars.filter((pillar) => resolveText(pillar.title, language));
  if (!title || pillars.length === 0) return null;
  const imageProject = getProjectByCode(engineeringIntro.image.projectCode);
  const full = variant === "full";
  const id = `engineering-title-${variant}`;

  return (
    <section className={full ? "section engineering engineering-full" : "section engineering"} id={full ? "engineering" : undefined} aria-labelledby={id}>
      <div className="container engineering-grid">
        <figure className="engineering-media">
          <div className="engineering-image-frame">
            <Image src={engineeringIntro.image.src} alt={caption?.text ?? ""} fill sizes="(max-width: 900px) 100vw, 42vw" className="engineering-image" />
          </div>
          {caption && (
            <figcaption className="media-caption">
              {imageProject ? <Link href={`/projects/${imageProject.slug}`}>{caption.text}</Link> : caption.text}
            </figcaption>
          )}
        </figure>

        <div className="engineering-copy">
          {kicker && <span className="kicker">{kicker.text}</span>}
          <h2 id={id} className="section-title engineering-title">{title.text}</h2>
          {subtitle && <p className="engineering-subtitle">{subtitle.text}</p>}

          <ol className="engineering-pillars">
            {pillars.map((pillar, index) => {
              const heading = resolveText(pillar.title, language);
              const text = resolveText(pillar.text, language);
              return (
                <li key={pillar.id} className="pillar">
                  <span className="pillar-number" aria-hidden="true">{formatNumber(index + 1, language, { minimumIntegerDigits: 2 })}</span>
                  <div className="pillar-body">
                    <h3 className="pillar-title">{heading?.text}</h3>
                    {text && <p className="pillar-text">{text.text}</p>}
                    {pillar.examples && (
                      <ul className="pillar-examples">
                        {pillar.examples.map((example) => {
                          const project = getProjectByCode(example.projectCode);
                          const exampleText = resolveText(example.text, language);
                          if (!exampleText) return null;
                          return (
                            <li key={example.projectCode}>
                              {project ? <Link href={`/projects/${project.slug}`} aria-label={`${exampleText.text} — ${projectTitle(project, language)}`}>{exampleText.text}</Link> : exampleText.text}
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>

          {!full && (
            <div className="engineering-action">
              <TextLink href="/about#engineering">{t.engineeringMore}</TextLink>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
