"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/lib/usePreferences";

/**
 * The image area of a project that has no photograph yet: a quiet drawing-sheet
 * frame with a line drawing of a building and, optionally, a short note. It
 * fills its parent exactly like a photograph would, so a card or hero keeps
 * the same dimensions with or without an image. Decorative: the project name
 * is always next to it.
 */
export function ProjectPlaceholder({ caption = true, className }: { caption?: boolean; className?: string }) {
  const { t } = useLanguage();
  return (
    <div className={className ? `project-placeholder ${className}` : "project-placeholder"} aria-hidden="true">
      <svg className="project-placeholder-icon" viewBox="0 0 64 48" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="square">
        <path d="M4 42.5h56" />
        <path d="M12 42.5V18h18v24.5" />
        <path d="M30 42.5V7h22v35.5" />
        <path d="M16 24h3M23 24h3M16 30h3M23 30h3M16 36h3M23 36h3" />
        <path d="M35 13h4M43 13h4M35 19h4M43 19h4M35 25h4M43 25h4M35 31h4M43 31h4" />
        <path d="M38.5 42.5V37h5v5.5" />
      </svg>
      {caption && <span className="project-placeholder-text">{t.imageComingSoon}</span>}
    </div>
  );
}

/**
 * A project image that falls back to the placeholder when the source is
 * missing or fails to load, without changing the size of its frame. The frame
 * itself (aspect ratio, background) belongs to the caller.
 */
export function ProjectImage({
  src,
  alt,
  className,
  sizes,
  priority = false,
  native = false,
  caption = true,
}: {
  src: string | undefined;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  native?: boolean; // A plain <img>, as the archive grid uses.
  caption?: boolean;
}) {
  const ref = useRef<HTMLImageElement>(null);
  const [failed, setFailed] = useState<string | null>(null);

  // An image that failed before hydration never fires onError in React.
  useEffect(() => {
    const image = ref.current;
    if (src && image && image.complete && image.naturalWidth === 0) setFailed(src);
  }, [src]);

  if (!src || failed === src) return <ProjectPlaceholder caption={caption} />;

  const onError = () => setFailed(src);
  if (native) {
    return <img ref={ref} src={src} alt={alt} className={className} loading={priority ? "eager" : "lazy"} decoding="async" draggable={false} onError={onError} />;
  }
  return <Image ref={ref} src={src} alt={alt} fill sizes={sizes} priority={priority} className={className} draggable={false} onError={onError} />;
}
