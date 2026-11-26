import type { AwardIconId } from "@/data/awards";

// One icon family for awards, drawn on a 48-unit grid with a single fine
// stroke. `.award-gilt` marks the one detail per icon that takes the
// restrained metallic accent. These stand in until the real award photographs
// are supplied (Award.image), never as pictures of the awards themselves.
export function AwardIcon({ icon }: { icon: AwardIconId }) {
  return (
    <svg viewBox="0 0 48 48" className="award-icon" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" strokeLinejoin="round">
      {icon === "trophy" && (
        <>
          <path d="M16 9h16v9a8 8 0 0 1-16 0z" />
          <path d="M16 12h-4a4 4 0 0 0 4 7M32 12h4a4 4 0 0 1-4 7" />
          <path d="M24 26v7M18 39h12M20 33h8v6h-8z" />
          <path className="award-gilt" d="m24 12 1.2 2.4 2.6.4-1.9 1.8.5 2.6-2.4-1.3-2.4 1.3.5-2.6-1.9-1.8 2.6-.4z" />
        </>
      )}
      {icon === "medal" && (
        <>
          <path d="M17 6l5 12M31 6l-5 12M17 6h-4l6 13M31 6h4l-6 13" />
          <circle cx="24" cy="30" r="11" />
          <circle className="award-gilt" cx="24" cy="30" r="6.5" />
        </>
      )}
      {icon === "laurel" && (
        <>
          <path d="M16 38c-6-4-9-11-8-19M32 38c6-4 9-11 8-19" />
          <path d="M9.5 24c2.5 0 4 1.5 4.5 3.5M9 18.5c2.5.5 3.5 2.2 3.6 4.2M11.5 30c2.4-.4 4 .7 5 2.5M30.5 30c-2.4-.4-4 .7-5 2.5M38.5 24c-2.5 0-4 1.5-4.5 3.5M39 18.5c-2.5.5-3.5 2.2-3.6 4.2" />
          <path className="award-gilt" d="m24 15 2 4 4.4.6-3.2 3.1.8 4.4-4-2.1-4 2.1.8-4.4-3.2-3.1L22 19z" />
        </>
      )}
      {icon === "certificate" && (
        <>
          <path d="M10 9h28v22H10z" />
          <path d="M15 15h18M15 20h12M15 25h8" />
          <circle className="award-gilt" cx="32" cy="31" r="5" />
          <path d="M29 35l-1.5 6 4.5-2 4.5 2-1.5-6" />
        </>
      )}
      {icon === "architecture" && (
        <>
          <path d="M8 40h32M11 40V20h26v20" />
          <path d="M16 40V24M22 40V24M28 40V24M34 40V24" />
          <path className="award-gilt" d="M8 20 24 9l16 11" />
        </>
      )}
      {icon === "recognition" && (
        <>
          <path d="M24 6l4 4h6v6l4 4-4 4v6h-6l-4 4-4-4h-6v-6l-4-4 4-4v-6h6z" />
          <path d="M18 36l-3 7 5-1.5 3 3.5 1-6M30 36l3 7-5-1.5-3 3.5-1-6" />
          <circle className="award-gilt" cx="24" cy="20" r="5" />
        </>
      )}
      {icon === "innovation" && (
        <>
          <path d="M24 7a10 10 0 0 0-6 18c1.4 1.1 2 2.5 2 4h8c0-1.5.6-2.9 2-4a10 10 0 0 0-6-18z" />
          <path d="M20 33h8M21 37h6" />
          <path className="award-gilt" d="M24 13v9M20 17.5h8" />
          <path d="M8 17h3M37 17h3M11 7l2 2M37 7l-2 2" />
        </>
      )}
      {icon === "crown" && (
        <>
          <path d="M10 34l-2-18 9 8 7-12 7 12 9-8-2 18z" />
          <path d="M10 39h28" />
          <circle className="award-gilt" cx="24" cy="12" r="2" />
          <circle cx="8" cy="15" r="1.6" />
          <circle cx="40" cy="15" r="1.6" />
          <path className="award-gilt" d="M17 30h14" />
        </>
      )}
    </svg>
  );
}

/** The award visual: the supplied photograph when there is one, otherwise the icon. */
export function AwardVisual({ icon, image, alt }: { icon: AwardIconId; image?: { src: string }; alt?: string }) {
  return (
    <span className="award-visual">
      {image ? <img src={image.src} alt={alt ?? ""} loading="lazy" decoding="async" /> : <AwardIcon icon={icon} />}
    </span>
  );
}
