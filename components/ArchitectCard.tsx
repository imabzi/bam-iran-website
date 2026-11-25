"use client";

import Link from "next/link";
import { architectBio, bamProjectCount, type Architect } from "@/data/architects";
import { formatNumber, resolveText } from "@/lib/i18n";
import { useLanguage } from "@/lib/usePreferences";
import { ArchitectPortrait } from "./ArchitectPortrait";
import { ArchitectVectorArtwork, type ArtworkVariant } from "./ArchitectVectorArtwork";
import { ArrowIcon } from "./ArrowIcon";
import { DemoBadge } from "./ui";

/**
 * An architect card: portrait, name, short biography and the number of BAM
 * projects credited to the architect. It never shows a project photograph:
 * the portrait frame holds the architect's own portrait when one is supplied,
 * and a vector placeholder until then. On the homepage, `artwork` swaps the
 * frame for an architectural line drawing.
 */
export function ArchitectCard({ architect, artwork, seed = 0 }: { architect: Architect; artwork?: ArtworkVariant; seed?: number }) {
  const { language, t } = useLanguage();
  const name = resolveText(architect.name, language);
  const bio = architectBio(architect);
  const shortBio = resolveText(bio.short, language);
  const count = bamProjectCount(architect.id);

  return (
    <Link href={`/architects/${architect.id}`} className="architect-card">
      {artwork !== undefined ? (
        <div className="architect-media architect-media-artwork">
          <ArchitectVectorArtwork variant={artwork} />
        </div>
      ) : (
        <ArchitectPortrait
          architect={architect}
          seed={seed}
          sizes="(max-width: 767px) 100vw, (max-width: 1100px) 50vw, 33vw"
          alt={name?.text ?? ""}
        />
      )}
      <div className="architect-meta">
        <div className="architect-name-row">
          {name && (
            <h3 className="architect-name" lang={name.lang !== language ? name.lang : undefined}>
              {name.text}
            </h3>
          )}
          <span className="architect-arrow" aria-hidden="true"><ArrowIcon /></span>
        </div>
        {shortBio && (
          <p className="architect-bio" lang={shortBio.lang !== language ? shortBio.lang : undefined}>
            {bio.shortIsSample && <DemoBadge label={t.sampleText} title={t.sampleTextNote} />} {shortBio.text}
          </p>
        )}
        {count > 0 && <p className="architect-count">{t.bamProjectsCount(formatNumber(count, language))}</p>}
      </div>
    </Link>
  );
}
