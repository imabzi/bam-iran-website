"use client";

import { formatNumber } from "@/lib/i18n";
import { useLanguage } from "@/lib/usePreferences";

/**
 * A two-column image section of the project page: interiors by default, or a
 * site plan, drawings, progress or general gallery. Hidden when it has no
 * images, so an empty section never appears.
 */
export function ProjectGallery({
  images,
  title,
  label,
  groups,
  contain = false,
}: {
  images: string[];
  title: string;
  label?: string; // Section label. Interiors when left out.
  groups?: Array<{ label?: string; images: string[] }>; // e.g. drawings by block
  contain?: boolean; // Plans and drawings are shown whole, never cropped.
}) {
  const { language, t } = useLanguage();
  const sections = (groups ?? [{ images }]).filter((group) => group.images.length > 0);
  if (sections.length === 0) return null;
  const heading = label ?? t.interiors;
  const alt = (index: number) => label
    ? t.galleryAlt(title, label, formatNumber(index + 1, language))
    : t.interiorAlt(title, formatNumber(index + 1, language));

  let position = 0;
  return (
    <section className="gallery-section">
      <span className="section-kicker">{heading}</span>
      {sections.map((group, groupIndex) => (
        <div className="gallery-group" key={groupIndex}>
          {group.label && <h3 className="gallery-group-title">{group.label}</h3>}
          <div className={contain ? "project-gallery is-contain" : "project-gallery"}>
            {group.images.map((src) => {
              const index = position++;
              return (
                <div className="gallery-card" key={index}>
                  <img src={src} alt={alt(index)} loading="lazy" decoding="async" />
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </section>
  );
}
