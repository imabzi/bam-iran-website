"use client";

import { ceoMessage, publishedPeople } from "@/data/team";
import { resolveText } from "@/lib/i18n";
import { useLanguage } from "@/lib/usePreferences";
import { PersonPortrait } from "../team/Team";

/**
 * The CEO message on the About page. The portrait, the written statement and
 * an optional video come from `ceoMessage` in data/team.ts. Until an approved
 * statement exists, the section shows the name and title with a short note:
 * no quotation is ever written on his behalf.
 */
export function CeoMessage() {
  const { language, t } = useLanguage();
  const person = publishedPeople.find((item) => item.id === ceoMessage.personId);
  if (!person) return null;
  const name = resolveText(person.name, language);
  const title = resolveText(person.title, language);
  const paragraphs = (ceoMessage.paragraphs ?? []).map((paragraph) => resolveText(paragraph, language)).filter((paragraph) => paragraph !== undefined);
  if (!name) return null;

  return (
    <section className="section ceo-message" aria-labelledby="ceo-message-title">
      <div className="container ceo-grid">
        <div className="ceo-portrait">
          <PersonPortrait person={person} sizes="(max-width: 900px) 100vw, 32vw" />
        </div>
        <div className="ceo-copy">
          <span className="kicker">{t.ceoMessage}</span>
          <h2 id="ceo-message-title" className="visually-hidden">{t.ceoMessage}</h2>
          {paragraphs.length > 0 ? (
            <blockquote className="ceo-statement">
              {paragraphs.map((paragraph, index) => <p key={index}>{paragraph.text}</p>)}
            </blockquote>
          ) : (
            <p className="ceo-pending">{t.ceoMessagePending}</p>
          )}
          {ceoMessage.video && (
            <video className="ceo-video" controls preload="none" poster={ceoMessage.video.poster} playsInline>
              <source src={ceoMessage.video.src} type="video/mp4" />
            </video>
          )}
          <p className="ceo-signature">
            <span className="ceo-name">{name.text}</span>
            {title && <span className="ceo-title">{title.text}</span>}
          </p>
        </div>
      </div>
    </section>
  );
}
